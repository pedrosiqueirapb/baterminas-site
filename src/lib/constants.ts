import type { Brand, Category, SiteSettings } from "@/types/content";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

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
  hero_title: "Baterias de qualidade para seguir em frente",
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
  seo_title: "Baterminas | Loja de baterias em Uberlândia - MG",
  seo_description:
    "Encontre baterias para carros, motos, caminhões e aplicações estacionárias na Baterminas. Atendimento rápido e entrega em toda Uberlândia.",
  show_reviews: true,
  show_about: true,
};

export const FALLBACK_BRANDS: Brand[] = ["Moura", "Zetta", "Varta", "Formax"].map((name, i) => ({
  id: `fallback-${name.toLowerCase()}`,
  name,
  description: `Baterias ${name} disponíveis na loja. Consulte as opções pelo WhatsApp.`,
  image_path: "",
  image_alt: `Bateria conceitual representando a marca ${name}`,
  sort_order: i,
  active: true,
}));

export const FALLBACK_CATEGORIES: Category[] = [
  { slug: "carros", title: "Baterias para carros", description: "Opções para veículos de passeio.", wa: "carro" },
  { slug: "motos", title: "Baterias para motos", description: "Opções para motocicletas.", wa: "moto" },
  { slug: "caminhoes", title: "Baterias para caminhões", description: "Opções para veículos pesados.", wa: "caminhão" },
  { slug: "estacionarias", title: "Baterias estacionárias", description: "Opções para sistemas estacionários.", wa: "sistema estacionário" },
  { slug: "nobreaks", title: "Baterias para nobreaks", description: "Opções para nobreaks.", wa: "nobreak" },
].map((c, i) => ({
  id: `fallback-${c.slug}`,
  slug: c.slug,
  title: c.title,
  description: c.description,
  image_path: "",
  image_alt: c.title,
  whatsapp_message: `Olá! Gostaria de consultar uma bateria para ${c.wa === "carro" ? "meu carro" : c.wa === "moto" ? "minha moto" : c.wa}.`,
  sort_order: i,
  published: true,
}));
