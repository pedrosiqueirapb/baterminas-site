import { describe, expect, it } from "vitest";
import { followsSentenceCase } from "@/lib/text";
import { formatWhatsapp, mapsUrl, normalizeWhatsapp, whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { brandSchema, settingsSchema, sniffImageType } from "@/lib/validation";
import { jsonLd, websiteJsonLd } from "@/lib/seo";
import { FALLBACK_SETTINGS } from "@/lib/constants";
import { collectHours } from "@/lib/hours";

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
    expect(whatsappUrl("5534999954450")).toBe("https://api.whatsapp.com/send?phone=5534999954450&text=Ol%C3%A1%2C%20gostaria%20de%20comprar%20uma%20bateria");
    expect(whatsappUrl("(34) 99995-4450")).toContain("phone=5534999954450&text=");
    expect(decodeURIComponent(whatsappUrl("5534999954450", { brand: "Moura" }).split("text=")[1])).toBe("Olá, gostaria de comprar uma bateria Moura");
    expect(decodeURIComponent(whatsappUrl("5534999954450", { category: { slug: "motos", title: "Motos" } }).split("text=")[1])).toBe("Olá, gostaria de comprar uma bateria para moto");
    expect(whatsappMessage({ brand: "Zetta", category: { slug: "carros", title: "Carros" } })).toBe("Olá, gostaria de comprar uma bateria para carro da marca Zetta");
    expect(whatsappMessage({ category: { slug: "x-abc", title: "Baterias para tratores" } })).toBe("Olá, gostaria de comprar uma bateria para tratores");
    expect(whatsappMessage({ brand: "Moura", message: "  Oi, quero Moura 60Ah  " })).toBe("Oi, quero Moura 60Ah");
    expect(whatsappMessage({ brand: "Moura", message: "" })).toBe("Olá, gostaria de comprar uma bateria Moura");
    expect(whatsappMessage({ category: { slug: "x-abc", title: "Tratores" } })).toBe("Olá, gostaria de comprar uma bateria para tratores");
  });
  it("normaliza números", () => {
    expect(normalizeWhatsapp("(34) 99995-4450")).toBe("5534999954450");
    expect(formatWhatsapp("5534999954450")).toBe("+55 34 99995-4450");
  });
  it("gera link do maps", () => {
    expect(mapsUrl("Av. X, 1")).toContain("destination=Av.%20X%2C%201");
  });
});

describe("telefone e whatsapp digitados com pontuação", () => {
  const base = { ...FALLBACK_SETTINGS, opening_hours: [] };
  it.each(["(34) 3229-5639", "34 3229 5639", "3432295639", "34-3229.5639", "(34)32295639"])("normaliza telefone %s", (v) => {
    const r = settingsSchema.safeParse({ ...base, phone: v });
    expect(r.success && r.data.phone).toBe("(34) 3229-5639");
  });
  it.each(["(34) 99995-4450", "+55 (34) 99995-4450", "34 9 9995 4450", "5534999954450", "34-99995-4450"])("normaliza whatsapp %s", (v) => {
    const r = settingsSchema.safeParse({ ...base, whatsapp: v });
    expect(r.success && r.data.whatsapp).toBe("5534999954450");
    expect(whatsappUrl(r.success ? r.data.whatsapp : "")).toContain("https://api.whatsapp.com/send?phone=5534999954450&text=");
  });
  it("rejeita números inválidos", () => {
    expect(settingsSchema.safeParse({ ...base, phone: "123" }).success).toBe(false);
    expect(settingsSchema.safeParse({ ...base, whatsapp: "()-" }).success).toBe(false);
  });
});

describe("validação", () => {
  it("rejeita título em Title Case nas marcas", () => {
    const r = brandSchema.safeParse({ name: "Moura", description: "Baterias Para Carros", image_alt: "", whatsapp_message: "", sort_order: 1, active: true });
    expect(r.success).toBe(false);
  });
  it("aceita marca válida", () => {
    expect(brandSchema.safeParse({ name: "Moura", description: "Consulte as opções pelo WhatsApp.", image_alt: "", whatsapp_message: "", sort_order: "2", active: true }).success).toBe(true);
  });
  it("valida configurações e rejeita URLs inseguras", () => {
    const ok = {
      ...FALLBACK_SETTINGS, whatsapp: "(34) 99995-4450", opening_hours: [],
    };
    expect(settingsSchema.safeParse(ok).success).toBe(true);
    expect(settingsSchema.safeParse({ ...ok, instagram_url: "javascript:alert(1)" }).success).toBe(false);
    expect(settingsSchema.safeParse({ ...ok, google_profile_url: "https://evil.example.com/x" }).success).toBe(false);
  });
  it("junta períodos e ignora linhas vazias", () => {
    expect(collectHours(["Segunda a sexta", "", " "], ["08:00 às 18:00", "", ""])).toEqual([{ label: "Segunda a sexta", hours: "08:00 às 18:00" }]);
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

describe("seo: dados estruturados com marcas e categorias", () => {
  it("inclui somente marcas e categorias recebidas e telefone do WhatsApp", () => {
    const brands = [{ id: "1", name: "Moura", description: "", image_path: "", image_alt: "", whatsapp_message: "", sort_order: 0, active: true }];
    const categories = [{ id: "c", slug: "carros", title: "Baterias para carros", description: "Opções", image_path: "", image_alt: "", whatsapp_message: "", sort_order: 0, published: true }];
    const j = JSON.parse(jsonLd(FALLBACK_SETTINGS, brands, categories));
    expect(j.brand).toEqual([{ "@type": "Brand", name: "Moura" }]);
    expect(j.knowsAbout).toEqual(["Baterias para carros"]);
    expect(j.hasOfferCatalog.itemListElement).toHaveLength(1);
    expect(j.contactPoint.telephone).toBe("+5534999954450");
  });
  it("não gera brand/catálogo quando não há itens e escapa < no WebSite", () => {
    const j = JSON.parse(jsonLd(FALLBACK_SETTINGS));
    expect(j.brand).toBeUndefined();
    expect(j.hasOfferCatalog).toBeUndefined();
    expect(websiteJsonLd({ ...FALLBACK_SETTINGS, business_name: "A</script>B" })).not.toContain("</script>");
  });
});
