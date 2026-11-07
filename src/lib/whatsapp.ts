export const DEFAULT_WHATSAPP = "5534999954450";

export function normalizeWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length <= 11 ? `55${digits}` : digits;
}

export const GENERIC_WHATSAPP_MESSAGE = "Olá, gostaria de comprar uma bateria";

const CATEGORY_SUFFIX: Record<string, string> = {
  carros: "carro",
  motos: "moto",
  caminhoes: "caminhão",
  estacionarias: "sistema estacionário",
  nobreaks: "nobreak",
};

/** Extrai a aplicação do título ("Baterias para tratores" vira "tratores"). */
function applicationName(title: string): string {
  return title.trim().toLowerCase().replace(/^baterias?\s+(para|de|do|da)\s+(o\s+|a\s+|os\s+|as\s+)?/, "");
}

export interface WhatsappInterest {
  /** Mensagem definida no painel; quando preenchida, substitui a automática. */
  message?: string;
  brand?: string;
  category?: { slug: string; title: string };
}

/** Monta a mensagem conforme marca e/ou aplicação de interesse. */
export function whatsappMessage({ brand, category, message }: WhatsappInterest = {}): string {
  if (message?.trim()) return message.trim();
  const categoryName = category ? (CATEGORY_SUFFIX[category.slug] ?? applicationName(category.title)) : "";
  const parts = [GENERIC_WHATSAPP_MESSAGE];
  if (categoryName) parts.push(`para ${categoryName}`);
  if (brand?.trim()) parts.push(categoryName ? `da marca ${brand.trim()}` : brand.trim());
  return parts.join(" ");
}

/** Link oficial do WhatsApp com mensagem pré-preenchida e codificada. */
export function whatsappUrl(number: string, interest: WhatsappInterest = {}): string {
  const phone = normalizeWhatsapp(number) || DEFAULT_WHATSAPP;
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(whatsappMessage(interest))}`;
}

export function formatWhatsapp(number: string): string {
  const d = normalizeWhatsapp(number);
  if (d.length === 13) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`;
  return `+${d}`;
}

export function mapsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
