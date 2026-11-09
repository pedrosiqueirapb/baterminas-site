import type { Brand, Category, SiteSettings } from "@/types/content";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Identificador interno da conta do painel. O Supabase Auth exige um e-mail por usuário, mas o painel
 * não envia nem recebe e-mails: o login usa apenas senha + código do autenticador.
 */
export const ADMIN_LOGIN_ID = "baterminas2024@gmail.com";
/** ID da Google tag (Google Ads) da Baterminas. Público: aparece no código de qualquer site que usa a tag. */
export const GOOGLE_TAG_ID = "AW-17611067849";
/** ID do contêiner do Google Tag Manager, informado pela gestora de tráfego. Público. */
export const GOOGLE_TAG_MANAGER_ID = "GTM-NHJ58GVK";
export const AUTOJADE_URL = "https://autojade.com.br/";
export const MAPS_DESTINATION = "Av. Comendador Alexandrino Garcia, 1270 - Marta Helena, Uberlândia - MG";

export const FALLBACK_SETTINGS: SiteSettings = {
  business_name: "Baterminas",
  phone: "(34) 3229-5639",
  whatsapp: "5534999954450",
  instagram_url: "https://www.instagram.com/baterminas_udia/",
  google_profile_url: "",
  address_line: "Av. Comendador Alexandrino Garcia, 1270",
  address_complement: "",
  neighborhood: "Marta Helena",
  city: "Uberlândia",
  state: "MG",
  postal_code: "",
  opening_hours: [],
  hours_note: "",
  hero_title: "Loja de baterias em Uberlândia com atendimento rápido",
  hero_description:
    "Encontre a bateria ideal para o seu veículo com atendimento rápido, marcas de qualidade e entrega em toda Uberlândia.",
  hero_image_path: "",
  hero_image_alt: "Veículo moderno em uma estrada ao entardecer",
  about_title: "Sua parceira em baterias em Uberlândia",
  about_text:
    "A Baterminas oferece soluções em baterias para diferentes veículos e aplicações, com atendimento próximo, marcas de qualidade e praticidade para você continuar sua jornada.",
  about_image_path: "",
  about_image_alt: "Ambiente automotivo profissional",
  cta_title: "Precisa de uma bateria?",
  cta_description: "Entre em contato com a Baterminas e consulte as opções disponíveis para o seu veículo.",
  footer_copyright: "© 2026 Baterminas. Todos os direitos reservados.",
  logo_path: "",
  seo_title: "Loja de baterias em Uberlândia - MG | Baterminas",
  seo_description:
    "Loja de baterias em Uberlândia: baterias para carros, motos, caminhões, estacionárias e nobreaks. Atendimento rápido e entrega em toda a cidade.",
  show_about: true,
};

export const FALLBACK_BRANDS: Brand[] = ["Moura", "Zetta", "Varta", "Formax"].map((name, i) => ({
  id: `fallback-${name.toLowerCase()}`,
  name,
  description: `Baterias ${name} disponíveis na loja. Consulte as opções pelo WhatsApp.`,
  image_path: "",
  image_alt: `Bateria conceitual representando a marca ${name}`,
  whatsapp_message: "",
  sort_order: i,
  active: true,
}));

export const FALLBACK_CATEGORIES: Category[] = [
  { slug: "carros", title: "Baterias para carros", description: "Opções para veículos de passeio." },
  { slug: "motos", title: "Baterias para motos", description: "Opções para motocicletas." },
  { slug: "caminhoes", title: "Baterias para caminhões", description: "Opções para veículos pesados." },
  { slug: "estacionarias", title: "Baterias estacionárias", description: "Opções para sistemas estacionários." },
  { slug: "nobreaks", title: "Baterias para nobreaks", description: "Opções para nobreaks." },
].map((c, i) => ({
  id: `fallback-${c.slug}`,
  slug: c.slug,
  title: c.title,
  description: c.description,
  image_path: "",
  image_alt: c.title,
  whatsapp_message: "",
  sort_order: i,
  published: true,
}));
