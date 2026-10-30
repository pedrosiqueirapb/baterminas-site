export type OpeningHour = { label: string; hours: string };

export type SiteSettings = {
  business_name: string;
  phone: string;
  whatsapp: string;
  instagram_url: string;
  google_profile_url: string;
  address_line: string;
  address_complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  opening_hours: OpeningHour[];
  hours_note: string;
  hero_title: string;
  hero_description: string;
  hero_image_path: string;
  hero_image_alt: string;
  about_title: string;
  about_text: string;
  about_image_path: string;
  about_image_alt: string;
  cta_title: string;
  cta_description: string;
  footer_copyright: string;
  logo_path: string;
  seo_title: string;
  seo_description: string;
  show_reviews: boolean;
  show_about: boolean;
};

export type Brand = {
  id: string;
  name: string;
  description: string;
  image_path: string;
  image_alt: string;
  sort_order: number;
  active: boolean;
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_path: string;
  image_alt: string;
  whatsapp_message: string;
  sort_order: number;
  published: boolean;
};

export type Testimonial = {
  id: string;
  display_name: string;
  body: string;
  testimonial_date: string | null;
  source: "cliente_loja" | "site";
  published: boolean;
};

export type ActionResult = { ok: true; message: string } | { ok: false; message: string; fieldErrors?: Record<string, string> };
