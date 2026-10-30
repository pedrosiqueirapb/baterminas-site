"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ADMIN_LOGIN_ID } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({ password: z.string().min(1).max(200) });
const codeSchema = z.object({ factorId: z.string().uuid(), code: z.string().trim().regex(/^\d{6}$/, "Informe o código de 6 dígitos.") });

async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
}

export type AuthState = { error?: string } | undefined;

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 8, 15 * 60_000)) return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };

  const parsed = loginSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { error: "Informe a senha." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_LOGIN_ID, password: parsed.data.password });
  if (error) return { error: "Senha incorreta." };
  redirect("/admin/mfa");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Estado do segundo fator para o usuário autenticado (aal1). */
export async function getMfaState(): Promise<{ step: "verify"; factorId: string } | { step: "enroll" } | { step: "done" }> {
  const supabase = await createClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) redirect("/admin/login");
  const { data: allowed } = await supabase.rpc("is_allowlisted");
  if (allowed !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login?erro=acesso");
  }
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") return { step: "done" };
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = factors?.totp?.find((f) => f.status === "verified");
  if (verified) return { step: "verify", factorId: verified.id };
  return { step: "enroll" };
}

export async function enrollTotp(): Promise<{ factorId: string; qrSvg: string; secret: string } | { error: string }> {
  const state = await getMfaState();
  if (state.step !== "enroll") return { error: "O segundo fator já está configurado." };
  const supabase = await createClient();
  // remove tentativas anteriores não verificadas
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const f of factors?.all ?? []) if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Aplicativo autenticador", issuer: "Baterminas" });
  if (error || !data) return { error: "Não foi possível iniciar a configuração. Tente novamente." };
  return { factorId: data.id, qrSvg: data.totp.qr_code, secret: data.totp.secret };
}

export async function verifyTotp(_: AuthState, formData: FormData): Promise<AuthState> {
  const ip = await clientIp();
  if (!rateLimit(`mfa:${ip}`, 8, 15 * 60_000)) return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  const parsed = codeSchema.safeParse({ factorId: formData.get("factorId"), code: formData.get("code") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Código inválido." };

  const supabase = await createClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) redirect("/admin/login");
  const { data: allowed } = await supabase.rpc("is_allowlisted");
  if (allowed !== true) redirect("/admin/login?erro=acesso");

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const owned = factors?.all?.some((f) => f.id === parsed.data.factorId);
  if (!owned) return { error: "Fator inválido." };

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: parsed.data.factorId, code: parsed.data.code });
  if (error) return { error: "Código incorreto ou expirado." };
  redirect("/admin");
}
