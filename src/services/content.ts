import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { FALLBACK_BRANDS, FALLBACK_CATEGORIES, FALLBACK_SETTINGS } from "@/lib/constants";
import type { Brand, Category, SiteSettings } from "@/types/content";

export const CONTENT_TAG = "site-content";

function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function publicImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/site-images/${path}`;
}

export type PublicContent = {
  settings: SiteSettings;
  brands: Brand[];
  categories: Category[];
  fromDatabase: boolean;
};

const SETTINGS_COLS =
  "business_name,phone,whatsapp,instagram_url,google_profile_url,address_line,address_complement,neighborhood,city,state,postal_code,opening_hours,hours_note,hero_title,hero_description,hero_image_path,hero_image_alt,about_title,about_text,about_image_path,about_image_alt,cta_title,cta_description,footer_copyright,logo_path,seo_title,seo_description,show_about";

async function loadContent(): Promise<PublicContent> {
  const supabase = anonClient();
  if (!supabase) return fallback();
  try {
    const [s, b, c] = await Promise.all([
      supabase.from("site_settings").select(SETTINGS_COLS).eq("id", 1).maybeSingle(),
      supabase.from("battery_brands").select("id,name,description,image_path,image_alt,whatsapp_message,sort_order,active").eq("active", true).order("sort_order"),
      supabase.from("battery_categories").select("id,slug,title,description,image_path,image_alt,whatsapp_message,sort_order,published").eq("published", true).order("sort_order"),
    ]);
    if (s.error || b.error || c.error || !s.data) {
      console.error("loadContent:", s.error?.code ?? b.error?.code ?? c.error?.code ?? "sem-configuracoes");
      return fallback();
    }
    return {
      settings: { ...FALLBACK_SETTINGS, ...(s.data as unknown as SiteSettings) },
      brands: (b.data ?? []) as Brand[],
      categories: (c.data ?? []) as Category[],
      fromDatabase: true,
    };
  } catch (e) {
    console.error("loadContent:", e instanceof Error ? e.message : "erro-desconhecido");
    return fallback();
  }
}

function fallback(): PublicContent {
  return { settings: FALLBACK_SETTINGS, brands: FALLBACK_BRANDS, categories: FALLBACK_CATEGORIES, fromDatabase: false };
}

/** Último conteúdo que veio do banco nesta instância do servidor (evita voltar a dados antigos fixos). */
let lastKnownContent: PublicContent | null = null;

/**
 * Uma leitura agrupada e cacheada. É invalidada por tag a cada publicação no painel; o prazo curto
 * garante que alterações apareçam mesmo se a hospedagem rodar mais de uma instância do servidor.
 */
export const getPublicContent = unstable_cache(
  async () => {
    const content = await loadContent();
    if (!content.fromDatabase) throw new Error("db-unavailable");
    return content;
  },
  ["public-content"],
  { tags: [CONTENT_TAG], revalidate: 60 },
).bind(null) as () => Promise<PublicContent>;

/** Versão resiliente: nunca lança. Se o banco falhar, usa o último conteúdo real conhecido; só sem ele recorre ao padrão fixo. */
export async function getContentSafe(): Promise<PublicContent> {
  try {
    const content = await getPublicContent();
    lastKnownContent = content;
    return content;
  } catch {
    return lastKnownContent ?? fallback();
  }
}
