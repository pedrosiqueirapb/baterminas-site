export const DEFAULT_WHATSAPP = "5534999954450";

export function normalizeWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length <= 11 ? `55${digits}` : digits;
}

/** Link direto para a conversa, sem mensagem pré-preenchida. */
export function whatsappUrl(number: string): string {
  return `https://wa.me/${normalizeWhatsapp(number) || DEFAULT_WHATSAPP}`;
}

export function formatWhatsapp(number: string): string {
  const d = normalizeWhatsapp(number);
  if (d.length === 13) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 9)}-${d.slice(9)}`;
  return `+${d}`;
}

export function telUrl(phone: string): string {
  return `tel:+55${phone.replace(/\D/g, "").replace(/^55/, "")}`;
}

export function mapsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
