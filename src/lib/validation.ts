import { z } from "zod";
import { CAPITALIZATION_MESSAGE, followsSentenceCase } from "@/lib/text";

const text = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .min(min, min ? "Campo obrigatório." : undefined)
    .max(max, `Use no máximo ${max} caracteres.`)
    .refine((v) => v === "" || followsSentenceCase(v), CAPITALIZATION_MESSAGE);

/** Aceita qualquer pontuação digitada e guarda sempre no formato (34) 3229-5639. */
export function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
}

const plain = (max: number, min = 0) => z.string().trim().min(min, min ? "Campo obrigatório." : undefined).max(max, `Use no máximo ${max} caracteres.`);

const httpsUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Informe uma URL iniciada por https://");

const storagePath = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^[a-z0-9/_-]+\.(jpg|png|webp|avif)$/.test(v), "Caminho de imagem inválido.");

export const hoursSchema = z
  .array(z.object({ label: plain(40, 1), hours: plain(40, 1) }))
  .max(10);

export const settingsSchema = z.object({
  business_name: plain(80, 1),
  phone: z
    .string()
    .trim()
    .refine((v) => /^\d{10,11}$/.test(v.replace(/\D/g, "")), "Telefone inválido. Exemplo: (34) 3229-5639")
    .transform(formatPhone),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => /^55\d{10,11}$/.test(v) || /^\d{10,11}$/.test(v), "Número de WhatsApp inválido.")
    .transform((v) => (v.length <= 11 ? `55${v}` : v)),
  instagram_url: httpsUrl.refine((v) => /^https:\/\/(www\.)?instagram\.com\//.test(v), "Informe um link do Instagram."),
  google_profile_url: httpsUrl.refine((v) => v === "" || /^https:\/\/(www\.)?(google\.[a-z.]+|maps\.app\.goo\.gl|g\.page|goo\.gl)\//.test(v), "Informe um link do Google."),
  address_line: plain(160, 1),
  address_complement: plain(120),
  neighborhood: plain(80, 1),
  city: plain(80, 1),
  state: z.string().trim().length(2).toUpperCase(),
  postal_code: z.string().trim().regex(/^(\d{5}-?\d{3})?$/, "CEP inválido."),
  opening_hours: hoursSchema,
  hours_note: text(200),
  hero_title: text(120, 1),
  hero_description: text(300, 1),
  hero_image_alt: text(200),
  about_title: text(120, 1),
  about_text: text(600, 1),
  about_image_alt: text(200),
  cta_title: text(120, 1),
  cta_description: text(300, 1),
  footer_copyright: plain(160, 1),
  seo_title: plain(70, 1),
  seo_description: plain(170, 1),
  show_about: z.boolean(),
});

export const brandSchema = z.object({
  name: plain(60, 1),
  description: text(300),
  image_alt: text(200),
  whatsapp_message: plain(200),
  active: z.boolean(),
});

export const categorySchema = z.object({
  title: text(80, 1),
  description: text(300),
  image_alt: text(200),
  whatsapp_message: plain(200),
  published: z.boolean(),
});

export const uuidSchema = z.string().uuid();

export const IMAGE_RULES = {
  maxBytes: 3 * 1024 * 1024,
  types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>,
};

/** Detecta o tipo real pelos primeiros bytes (não confia em extensão nem em Content-Type). */
export function sniffImageType(bytes: Uint8Array): keyof typeof IMAGE_RULES.types | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  const ascii = (s: number, e: number) => String.fromCharCode(...bytes.slice(s, e));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && /avif|avis/.test(ascii(8, 16))) return "image/avif";
  return null;
}

export { storagePath };
