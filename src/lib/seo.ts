import { SITE_URL } from "@/lib/constants";
import type { SiteSettings } from "@/types/content";

const ORDER = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];
const EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY = "segunda|ter[çc]a|quarta|quinta|sexta|s[áa]bado|domingo";

const norm = (d: string) => d.toLowerCase().replace("terca", "terça").replace("sabado", "sábado");

/** Converte rótulos como "Segunda a sexta", "Sábado" ou "Sábado e domingo" em dias do Schema.org. */
export function parseDays(label: string): string[] {
  const l = label.toLowerCase();
  const range = new RegExp(`(${DAY})(?:-feira)?\\s*(?:a|à|até|-|–)\\s*(${DAY})`).exec(l);
  if (range) {
    const i = ORDER.indexOf(norm(range[1]));
    const j = ORDER.indexOf(norm(range[2]));
    const out: string[] = [];
    for (let k = i; out.length < 7; k = (k + 1) % 7) {
      out.push(EN[k]);
      if (k === j) break;
    }
    return out;
  }
  const found = l.match(new RegExp(DAY, "g")) ?? [];
  return [...new Set(found.map((d) => EN[ORDER.indexOf(norm(d))]))];
}

/** JSON-LD AutoPartsStore apenas com dados reais e visíveis na página. Sem geo, sem nota inventada. */
export function jsonLd(s: SiteSettings): string {
  const sameAs = [s.instagram_url, s.google_profile_url].filter(Boolean);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: s.business_name,
    url: SITE_URL,
    telephone: `+55${s.phone.replace(/\D/g, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address_line,
      addressLocality: s.city,
      addressRegion: s.state,
      addressCountry: "BR",
      ...(s.postal_code ? { postalCode: s.postal_code } : {}),
    },
    areaServed: { "@type": "City", name: s.city },
    paymentAccepted: "Dinheiro, PIX, cartão de crédito, cartão de débito",
    sameAs,
  };
  const specs = s.opening_hours
    .map((h) => {
      const m = /(\d{1,2})[:h](\d{2})?\s*(?:às|a|-|–)\s*(\d{1,2})[:h](\d{2})?/i.exec(h.hours);
      const days = parseDays(h.label);
      if (!m || days.length === 0) return null;
      const t = (hh: string, mm?: string) => `${hh.padStart(2, "0")}:${mm ?? "00"}`;
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens: t(m[1], m[2]), closes: t(m[3], m[4]) };
    })
    .filter(Boolean);
  if (specs.length > 0) data.openingHoursSpecification = specs;
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
