export const DEFAULT_WHATSAPP = "5534999954450";

export const WA_MESSAGES = {
  general: "Olá! Gostaria de saber quais baterias estão disponíveis.",
  info: "Olá! Gostaria de mais informações sobre a Baterminas.",
  car: "Olá! Gostaria de consultar uma bateria para meu carro.",
  motorcycle: "Olá! Gostaria de consultar uma bateria para minha moto.",
} as const;

export function normalizeWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length <= 11 ? `55${digits}` : digits;
}

export function whatsappUrl(number: string, message?: string): string {
  const base = `https://wa.me/${normalizeWhatsapp(number) || DEFAULT_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
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
