"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { logAdminAction, requireAdmin } from "@/lib/auth";
import { parseHours } from "@/lib/hours";
import {
  IMAGE_RULES, brandSchema, categorySchema, settingsSchema, sniffImageType, uuidSchema,
} from "@/lib/validation";
import { CONTENT_TAG } from "@/services/content";
import type { ActionResult } from "@/types/content";
import type { ZodError } from "zod";

type Admin = Awaited<ReturnType<typeof requireAdmin>>;
const PATH_RE = /^[a-z0-9]+\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/;
const BUCKET = "site-images";

function publish() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

function fail(e: ZodError): ActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const i of e.issues) fieldErrors[String(i.path[0] ?? "form")] ??= i.message;
  return { ok: false, message: "Corrija os campos destacados.", fieldErrors };
}

const dbError = (): ActionResult => ({ ok: false, message: "Não foi possível salvar. Verifique sua permissão e tente novamente." });

async function uploadImage(admin: Admin, file: File, folder: string): Promise<{ path: string } | { error: string }> {
  if (file.size === 0) return { error: "Selecione um arquivo." };
  if (file.size > IMAGE_RULES.maxBytes) return { error: "A imagem deve ter no máximo 3 MB." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImageType(bytes);
  if (!type) return { error: "Formato inválido. Envie JPG, PNG, WebP ou AVIF." };
  const path = `${folder}/${randomUUID()}.${IMAGE_RULES.types[type]}`;
  const { error } = await admin.supabase.storage.from(BUCKET).upload(path, bytes, { contentType: type, upsert: false, cacheControl: "31536000" });
  if (error) return { error: "Falha no envio da imagem." };
  return { path };
}

async function removeImage(admin: Admin, path: string | null | undefined) {
  if (path && PATH_RE.test(path)) await admin.supabase.storage.from(BUCKET).remove([path]);
}

const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const fileOf = (fd: FormData, k: string) => {
  const f = fd.get(k);
  return f instanceof File && f.size > 0 ? f : null;
};


/* ---------- Configurações ---------- */
export async function saveSettings(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    business_name: str(fd, "business_name"), phone: str(fd, "phone"), whatsapp: str(fd, "whatsapp"),
    instagram_url: str(fd, "instagram_url"), google_profile_url: str(fd, "google_profile_url"),
    address_line: str(fd, "address_line"), address_complement: str(fd, "address_complement"),
    neighborhood: str(fd, "neighborhood"), city: str(fd, "city"), state: str(fd, "state"), postal_code: str(fd, "postal_code"),
    opening_hours: parseHours(str(fd, "opening_hours")), hours_note: str(fd, "hours_note"),
    hero_title: str(fd, "hero_title"), hero_description: str(fd, "hero_description"), hero_image_alt: str(fd, "hero_image_alt"),
    about_title: str(fd, "about_title"), about_text: str(fd, "about_text"), about_image_alt: str(fd, "about_image_alt"),
    cta_title: str(fd, "cta_title"), cta_description: str(fd, "cta_description"),
    footer_copyright: str(fd, "footer_copyright"), seo_title: str(fd, "seo_title"), seo_description: str(fd, "seo_description"),
    show_reviews: bool(fd, "show_reviews"), show_about: bool(fd, "show_about"),
  });
  if (!parsed.success) return fail(parsed.error);
  const { error } = await admin.supabase.from("site_settings").update(parsed.data).eq("id", 1);
  if (error) return dbError();
  await logAdminAction(admin.supabase, admin.user.id, "update", "site_settings", "1");
  publish();
  return { ok: true, message: "Configurações publicadas." };
}

/* ---------- Imagens do site (logo, hero, sobre) ---------- */
const SLOTS = { logo: "logo_path", hero: "hero_image_path", about: "about_image_path" } as const;

export async function uploadSiteImage(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const slot = str(fd, "slot") as keyof typeof SLOTS;
  if (!(slot in SLOTS)) return { ok: false, message: "Local de imagem inválido." };
  const file = fileOf(fd, "file");
  if (!file) return { ok: false, message: "Selecione uma imagem." };
  const column = SLOTS[slot];
  const { data: current } = await admin.supabase.from("site_settings").select(column).eq("id", 1).maybeSingle();
  const up = await uploadImage(admin, file, slot);
  if ("error" in up) return { ok: false, message: up.error };
  const { error } = await admin.supabase.from("site_settings").update({ [column]: up.path }).eq("id", 1);
  if (error) { await removeImage(admin, up.path); return dbError(); }
  await removeImage(admin, (current as Record<string, string> | null)?.[column]);
  await logAdminAction(admin.supabase, admin.user.id, "upload", "site_settings", slot);
  publish();
  return { ok: true, message: "Imagem publicada." };
}

export async function resetSiteImage(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const slot = str(fd, "slot") as keyof typeof SLOTS;
  if (!(slot in SLOTS)) return { ok: false, message: "Local de imagem inválido." };
  const column = SLOTS[slot];
  const { data: current } = await admin.supabase.from("site_settings").select(column).eq("id", 1).maybeSingle();
  const { error } = await admin.supabase.from("site_settings").update({ [column]: "" }).eq("id", 1);
  if (error) return dbError();
  await removeImage(admin, (current as Record<string, string> | null)?.[column]);
  await logAdminAction(admin.supabase, admin.user.id, "reset-image", "site_settings", slot);
  publish();
  return { ok: true, message: "Imagem padrão restaurada." };
}

/* ---------- Marcas ---------- */
export async function saveBrand(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const idRaw = str(fd, "id");
  const parsed = brandSchema.safeParse({
    name: str(fd, "name"), description: str(fd, "description"), image_alt: str(fd, "image_alt"),
    sort_order: str(fd, "sort_order") || "0", active: bool(fd, "active"),
  });
  if (!parsed.success) return fail(parsed.error);

  let imagePath: string | undefined;
  const file = fileOf(fd, "file");
  if (file) {
    const up = await uploadImage(admin, file, "brands");
    if ("error" in up) return { ok: false, message: up.error, fieldErrors: { file: up.error } };
    imagePath = up.path;
  }

  if (idRaw) {
    if (!uuidSchema.safeParse(idRaw).success) return { ok: false, message: "Identificador inválido." };
    const { data: old } = await admin.supabase.from("battery_brands").select("image_path").eq("id", idRaw).maybeSingle();
    const { error } = await admin.supabase.from("battery_brands").update({ ...parsed.data, ...(imagePath ? { image_path: imagePath } : {}) }).eq("id", idRaw);
    if (error) { await removeImage(admin, imagePath); return dbError(); }
    if (imagePath) await removeImage(admin, old?.image_path);
    await logAdminAction(admin.supabase, admin.user.id, "update", "battery_brands", idRaw);
  } else {
    const { data, error } = await admin.supabase.from("battery_brands").insert({ ...parsed.data, image_path: imagePath ?? "" }).select("id").single();
    if (error) { await removeImage(admin, imagePath); return dbError(); }
    await logAdminAction(admin.supabase, admin.user.id, "create", "battery_brands", data.id);
  }
  publish();
  return { ok: true, message: idRaw ? "Marca atualizada." : "Marca criada." };
}

export async function deleteBrand(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  if (!uuidSchema.safeParse(id).success) return { ok: false, message: "Identificador inválido." };
  const { data: old } = await admin.supabase.from("battery_brands").select("image_path").eq("id", id).maybeSingle();
  const { error } = await admin.supabase.from("battery_brands").delete().eq("id", id);
  if (error) return dbError();
  await removeImage(admin, old?.image_path);
  await logAdminAction(admin.supabase, admin.user.id, "delete", "battery_brands", id);
  publish();
  return { ok: true, message: "Marca excluída." };
}

async function reorder(table: "battery_brands" | "battery_categories", id: string, dir: "up" | "down") {
  const admin = await requireAdmin();
  if (!uuidSchema.safeParse(id).success || (dir !== "up" && dir !== "down")) return { ok: false, message: "Pedido inválido." } as ActionResult;
  const { data } = await admin.supabase.from(table).select("id").order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return { ok: true, message: "Ordem mantida." } as ActionResult;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  for (let k = 0; k < ids.length; k++) {
    const { error } = await admin.supabase.from(table).update({ sort_order: k }).eq("id", ids[k]);
    if (error) return dbError();
  }
  await logAdminAction(admin.supabase, admin.user.id, "reorder", table, id);
  publish();
  return { ok: true, message: "Ordem atualizada." } as ActionResult;
}

export async function moveBrand(_: ActionResult | undefined, fd: FormData) { return reorder("battery_brands", str(fd, "id"), str(fd, "dir") as "up" | "down"); }
export async function moveCategory(_: ActionResult | undefined, fd: FormData) { return reorder("battery_categories", str(fd, "id"), str(fd, "dir") as "up" | "down"); }

/* ---------- Categorias ---------- */
export async function saveCategory(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  if (!uuidSchema.safeParse(id).success) return { ok: false, message: "Identificador inválido." };
  const parsed = categorySchema.safeParse({
    title: str(fd, "title"), description: str(fd, "description"), image_alt: str(fd, "image_alt"),
    sort_order: str(fd, "sort_order") || "0", published: bool(fd, "published"),
  });
  if (!parsed.success) return fail(parsed.error);

  let imagePath: string | undefined;
  const file = fileOf(fd, "file");
  if (file) {
    const up = await uploadImage(admin, file, "categories");
    if ("error" in up) return { ok: false, message: up.error, fieldErrors: { file: up.error } };
    imagePath = up.path;
  }
  const { data: old } = await admin.supabase.from("battery_categories").select("image_path").eq("id", id).maybeSingle();
  const { error } = await admin.supabase.from("battery_categories").update({ ...parsed.data, ...(imagePath ? { image_path: imagePath } : {}) }).eq("id", id);
  if (error) { await removeImage(admin, imagePath); return dbError(); }
  if (imagePath) await removeImage(admin, old?.image_path);
  await logAdminAction(admin.supabase, admin.user.id, "update", "battery_categories", id);
  publish();
  return { ok: true, message: "Categoria atualizada." };
}
