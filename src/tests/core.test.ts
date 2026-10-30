import { describe, expect, it } from "vitest";
import { followsSentenceCase } from "@/lib/text";
import { formatWhatsapp, mapsUrl, normalizeWhatsapp, whatsappUrl } from "@/lib/whatsapp";
import { brandSchema, settingsSchema, sniffImageType } from "@/lib/validation";
import { jsonLd } from "@/lib/seo";
import { FALLBACK_SETTINGS } from "@/lib/constants";
import { parseHours } from "@/lib/hours";

describe("regra de capitalização", () => {
  it.each([
    "Baterias para o seu veículo",
    "Atendimento rápido e eficiente",
    "Entre em contato pelo WhatsApp",
    "Entrega em toda Uberlândia",
    "Baterias Moura, Zetta, Varta e Formax",
    "Pague em dinheiro, PIX ou cartões de crédito e débito.",
    "© 2026 Baterminas. Todos os direitos reservados.",
  ])("aceita %s", (t) => expect(followsSentenceCase(t)).toBe(true));

  it.each([
    "Baterias Para O Seu Veículo",
    "Atendimento Rápido E Eficiente",
    "TRABALHAMOS COM MARCAS DE QUALIDADE",
  ])("rejeita %s", (t) => expect(followsSentenceCase(t)).toBe(false));
});

describe("whatsapp e links", () => {
  it("gera link direto, sem mensagem pré-preenchida", () => {
    expect(whatsappUrl("5534999954450")).toBe("https://wa.me/5534999954450");
    expect(whatsappUrl("(34) 99995-4450")).toBe("https://wa.me/5534999954450");
    expect(whatsappUrl("5534999954450")).not.toContain("text=");
  });
  it("normaliza números", () => {
    expect(normalizeWhatsapp("(34) 99995-4450")).toBe("5534999954450");
    expect(formatWhatsapp("5534999954450")).toBe("+55 34 99995-4450");
  });
  it("gera link do maps", () => {
    expect(mapsUrl("Av. X, 1")).toContain("destination=Av.%20X%2C%201");
  });
});

describe("validação", () => {
  it("rejeita título em Title Case nas marcas", () => {
    const r = brandSchema.safeParse({ name: "Moura", description: "Baterias Para Carros", image_alt: "", sort_order: 1, active: true });
    expect(r.success).toBe(false);
  });
  it("aceita marca válida", () => {
    expect(brandSchema.safeParse({ name: "Moura", description: "Consulte as opções pelo WhatsApp.", image_alt: "", sort_order: "2", active: true }).success).toBe(true);
  });
  it("valida configurações e rejeita URLs inseguras", () => {
    const ok = {
      ...FALLBACK_SETTINGS, whatsapp: "(34) 99995-4450", opening_hours: [],
    };
    expect(settingsSchema.safeParse(ok).success).toBe(true);
    expect(settingsSchema.safeParse({ ...ok, instagram_url: "javascript:alert(1)" }).success).toBe(false);
    expect(settingsSchema.safeParse({ ...ok, google_profile_url: "https://evil.example.com/x" }).success).toBe(false);
  });
  it("analisa horários", () => {
    expect(parseHours("Segunda a sexta | 08:00 às 18:00\n")).toEqual([{ label: "Segunda a sexta", hours: "08:00 às 18:00" }]);
  });
});

describe("upload", () => {
  it("detecta tipos pelos bytes e rejeita o resto", () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))).toBe("image/png");
    expect(sniffImageType(new TextEncoder().encode("<script>alert(1)</script>"))).toBeNull();
    expect(sniffImageType(new TextEncoder().encode("GIF89a......"))).toBeNull();
  });
});

describe("json-ld", () => {
  it("não inventa horários, geo ou avaliação", () => {
    const j = JSON.parse(jsonLd(FALLBACK_SETTINGS));
    expect(j["@type"]).toBe("AutoPartsStore");
    expect(j.openingHoursSpecification).toBeUndefined();
    expect(j.geo).toBeUndefined();
    expect(j.aggregateRating).toBeUndefined();
    expect(j.telephone).toBe("+553432295639");
  });
  it("inclui horários reais quando cadastrados", () => {
    const j = JSON.parse(jsonLd({ ...FALLBACK_SETTINGS, opening_hours: [{ label: "Segunda a sexta", hours: "08:00 às 18:00" }] }));
    expect(j.openingHoursSpecification[0].dayOfWeek).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    expect(j.openingHoursSpecification[0].opens).toBe("08:00");
    expect(j.openingHoursSpecification[0].closes).toBe("18:00");
  });
});
