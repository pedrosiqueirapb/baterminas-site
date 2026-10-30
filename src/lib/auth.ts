import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Garante, no servidor, que o usuário: tem sessão válida (getUser valida o JWT no Supabase Auth),
 * está na allowlist `admin_users` e concluiu o TOTP (aal2). O banco repete a verificação via RLS.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/admin/login");

  const { data: allowed } = await supabase.rpc("is_allowlisted");
  if (allowed !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login?erro=acesso");
  }

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== "aal2") redirect("/admin/mfa");

  return { supabase, user };
}

export async function logAdminAction(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
) {
  await supabase.from("audit_log").insert({ user_id: userId, action, entity, entity_id: entityId ?? null });
}
