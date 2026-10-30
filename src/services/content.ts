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
  "business_name,phone,whatsapp,instagram_url,google_profile_url,address_line,address_complement,neighborhood,city,state,postal_code,opening_hours,hours_note,hero_title,hero_description,hero_image_path,hero_image_alt,about_title,about_text,about_image_path,about_image_alt,cta_title,cta_description,footer_copyright,logo_path,seo_title,seo_description,show_reviews,show_about";

async function loadContent(): Promise<PublicContent> {
  const supabase = anonClient();
  if (!supabase) return fallback();
  try {
    const [s, b, c] = await Promise.all([
      supabase.from("site_settings").select(SETTINGS_COLS).eq("id", 1).maybeSingle(),
      supabase.from("battery_brands").select("id,name,description,image_path,image_alt,sort_order,active").eq("active", true).order("sort_order"),
      supabase.from("battery_categories").select("id,slug,title,description,image_path,image_alt,sort_order,published").eq("published", true).order("sort_order"),
    ]);
    if (s.error || b.error || c.error || !s.data) return fallback();
    return {
      settings: { ...FALLBACK_SETTINGS, ...(s.data as unknown as SiteSettings) },
      brands: (b.data ?? []) as Brand[],
      categories: (c.data ?? []) as Category[],
      fromDatabase: true,
    };
  } catch {
    return fallback();
  }
}

function fallback(): PublicContent {
  return { settings: FALLBACK_SETTINGS, brands: FALLBACK_BRANDS, categories: FALLBACK_CATEGORIES, fromDatabase: false };
}

/** Uma leitura agrupada, cacheada e invalidada por tag após cada publicação no painel. */
export const getPublicContent = unstable_cache(
  async () => {
    const content = await loadContent();
    if (!content.fromDatabase) throw new Error("db-unavailable");
    return content;
  },
  ["public-content"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
).bind(null) as () => Promise<PublicContent>;

/** Versão resiliente: nunca lança; usa contingência quando o banco está indisponível. */
export async function getContentSafe(): Promise<PublicContent> {
  try {
    return await getPublicContent();
  } catch {
    return fallback();
  }
}
