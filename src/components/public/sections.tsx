import Image from "next/image";
import { BadgeCheck, Banknote, Clock, MapPin, Phone, Star, Truck, Zap } from "lucide-react";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/brand-icons";
import { MAPS_DESTINATION } from "@/lib/constants";
import type { GoogleReviews } from "@/lib/google-places";
import { WA_MESSAGES, formatWhatsapp, mapsUrl, telUrl, whatsappUrl } from "@/lib/whatsapp";
import { publicImageUrl } from "@/services/content";
import type { Brand, Category, SiteSettings, Testimonial } from "@/types/content";

const CATEGORY_DEFAULTS: Record<string, string> = {
  carros: "/images/categoria-carros.webp",
  motos: "/images/categoria-motos.webp",
  caminhoes: "/images/categoria-caminhoes.webp",
  estacionarias: "/images/categoria-estacionarias.webp",
  nobreaks: "/images/categoria-nobreaks.webp",
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Hero({ s }: { s: SiteSettings }) {
  const img = publicImageUrl(s.hero_image_path) ?? "/images/hero-carro-estrada.webp";
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <Image src={img} alt={s.hero_image_alt} fill priority fetchPriority="high" sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20 sm:via-ink/70" aria-hidden="true" />
      <div className="container-page flex min-h-[34rem] flex-col justify-center py-20 sm:min-h-[40rem]">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
          <MapPin aria-hidden="true" className="h-4 w-4" /> {s.city}, {s.state}
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">{s.hero_title}</h1>
        <p className="mt-5 max-w-xl text-lg text-white/80 sm:text-xl">{s.hero_description}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappUrl(s.whatsapp, WA_MESSAGES.general)} {...ext} className="btn btn-primary">
            <WhatsappIcon /> Fale pelo WhatsApp
          </a>
          <a href={mapsUrl(MAPS_DESTINATION)} {...ext} className="btn btn-outline">
            <MapPin aria-hidden="true" className="h-5 w-5" /> Como chegar
          </a>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Zap, title: "Atendimento ágil", text: "Conte com uma equipe preparada para ajudar você a encontrar a bateria ideal." },
  { icon: BadgeCheck, title: "Marcas de qualidade", text: "Trabalhamos com marcas reconhecidas no mercado de baterias." },
  { icon: Truck, title: "Entrega em Uberlândia", text: "Receba sua bateria com praticidade em toda Uberlândia." },
  { icon: Banknote, title: "Pagamento facilitado", text: "Pague em dinheiro, PIX ou cartões de crédito e débito." },
];

export function Features() {
  return (
    <section aria-labelledby="diferenciais" className="py-16 sm:py-20">
      <div className="container-page">
        <h2 id="diferenciais" className="sr-only">Diferenciais da Baterminas</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-6">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-ink">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Categories({ items, s }: { items: Category[]; s: SiteSettings }) {
  return (
    <section id="baterias" aria-labelledby="t-baterias" className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <span className="eyebrow">Aplicações</span>
        <h2 id="t-baterias" className="section-title max-w-2xl">Baterias para o seu veículo e para outras aplicações</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <li key={c.id} className="card flex flex-col overflow-hidden">
              <Image
                src={publicImageUrl(c.image_path) ?? CATEGORY_DEFAULTS[c.slug] ?? "/images/bateria-conceitual.webp"}
                alt={c.image_alt || c.title}
                width={800}
                height={600}
                sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-muted">{c.description}</p>
                <a href={whatsappUrl(s.whatsapp, c.whatsapp_message || WA_MESSAGES.general)} {...ext} className="btn btn-dark mt-5 w-full">
                  <WhatsappIcon /> Consultar disponibilidade
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Brands({ items, s }: { items: Brand[]; s: SiteSettings }) {
  if (items.length === 0) return null;
  return (
    <section id="marcas" aria-labelledby="t-marcas" className="on-dark bg-ink py-16 text-white sm:py-24">
      <div className="container-page">
        <span className="mb-3 inline-block text-sm font-semibold text-brand">Marcas</span>
        <h2 id="t-marcas" className="section-title max-w-2xl">Baterias {items.map((b) => b.name).slice(0, -1).join(", ")}{items.length > 1 ? " e " : ""}{items[items.length - 1].name}</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((b) => (
            <li key={b.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
              <Image
                src={publicImageUrl(b.image_path) ?? "/images/bateria-conceitual.webp"}
                alt={b.image_alt || `Bateria da marca ${b.name}`}
                width={800}
                height={600}
                sizes="(min-width:1024px) 280px, (min-width:640px) 50vw, 100vw"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-semibold text-brand">{b.name}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] text-white/75">{b.description}</p>
                <a
                  href={whatsappUrl(s.whatsapp, `Olá! Gostaria de consultar baterias ${b.name}.`)}
                  {...ext}
                  aria-label={`Consultar baterias ${b.name} pelo WhatsApp`}
                  className="btn btn-primary mt-4 w-full"
                >
                  <WhatsappIcon /> Consultar
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-white/60">Imagens ilustrativas, sem representar produtos ou embalagens específicas.</p>
      </div>
    </section>
  );
}

export function About({ s }: { s: SiteSettings }) {
  if (!s.show_about) return null;
  return (
    <section id="sobre" aria-labelledby="t-sobre" className="py-16 sm:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Sobre a loja</span>
          <h2 id="t-sobre" className="section-title">{s.about_title}</h2>
          <p className="mt-5 text-lg text-muted">{s.about_text}</p>
          <ul className="mt-6 space-y-2 text-[0.95rem]">
            {["Atendimento presencial na loja", `Entrega em toda ${s.city}`, "Contato rápido pelo WhatsApp"].map((t) => (
              <li key={t} className="flex items-center gap-2"><BadgeCheck aria-hidden="true" className="h-5 w-5 text-brand-dark" />{t}</li>
            ))}
          </ul>
        </div>
        <Image
          src={publicImageUrl(s.about_image_path) ?? "/images/sobre-bancada-ferramentas.webp"}
          alt={s.about_image_alt}
          width={900}
          height={675}
          sizes="(min-width:1024px) 540px, 100vw"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-2xl border border-ink/10 object-cover shadow-sm"
        />
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span role="img" aria-label={`${value.toFixed(1).replace(".", ",")} de 5 estrelas`} className="inline-flex gap-0.5 text-brand-dark">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden="true" className="h-4 w-4" fill={i <= Math.round(value) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

export function Reviews({ s, google, testimonials }: { s: SiteSettings; google: GoogleReviews | null; testimonials: Testimonial[] }) {
  if (!s.show_reviews) return null;
  const profile = s.google_profile_url || google?.mapsUri || "";
  return (
    <section id="avaliacoes" aria-labelledby="t-aval" className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <span className="eyebrow">Avaliações</span>
        <h2 id="t-aval" className="section-title max-w-2xl">O que dizem sobre a Baterminas</h2>

        {google && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.95rem]">
            <span className="font-display text-3xl font-bold">{google.rating.toFixed(1).replace(".", ",")}</span>
            <Stars value={google.rating} />
            <span className="text-muted">{google.total} avaliações no Google</span>
          </div>
        )}

        {google && google.reviews.length > 0 && (
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {google.reviews.map((r, i) => (
              <li key={i} className="card p-6">
                <Stars value={r.rating} />
                <blockquote className="mt-3 text-[0.95rem]">{r.text}</blockquote>
                <p className="mt-4 text-sm font-semibold">{r.author}</p>
                {r.when && <p className="text-sm text-muted">{r.when}</p>}
              </li>
            ))}
          </ul>
        )}
        {google && <p className="mt-4 text-xs text-muted">Avaliações do Google. Fonte: Google Maps.</p>}

        {testimonials.length > 0 && (
          <div className="mt-10">
            <h3 className="font-display text-xl font-semibold">Depoimentos de clientes da loja</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.id} className="card p-6">
                  <blockquote className="text-[0.95rem]">{t.body}</blockquote>
                  <p className="mt-4 text-sm font-semibold">{t.display_name}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Depoimentos autorizados, cadastrados pela loja.</p>
          </div>
        )}

        {profile && (
          <a href={profile} {...ext} className="btn btn-outline-dark mt-8">
            <Star aria-hidden="true" className="h-5 w-5" /> Ver avaliações no Google
          </a>
        )}
        {!profile && !google && testimonials.length === 0 && (
          <p className="mt-6 text-muted">As avaliações serão exibidas aqui em breve.</p>
        )}
      </div>
    </section>
  );
}

export function Cta({ s }: { s: SiteSettings }) {
  return (
    <section aria-labelledby="t-cta" className="on-dark bg-brand py-16 text-ink sm:py-20">
      <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <h2 id="t-cta" className="section-title">{s.cta_title}</h2>
          <p className="mt-3 max-w-xl text-lg text-ink/80">{s.cta_description}</p>
        </div>
        <a href={whatsappUrl(s.whatsapp, WA_MESSAGES.general)} {...ext} className="btn btn-dark !min-h-14 w-full !px-8 text-lg lg:w-auto">
          <WhatsappIcon className="h-6 w-6" /> Consultar pelo WhatsApp
        </a>
      </div>
    </section>
  );
}

export function Location({ s }: { s: SiteSettings }) {
  const address = `${s.address_line}${s.address_complement ? `, ${s.address_complement}` : ""} - ${s.neighborhood}, ${s.city} - ${s.state}`;
  return (
    <section id="contato" aria-labelledby="t-contato" className="py-16 sm:py-24">
      <div className="container-page">
        <span className="eyebrow">Localização e contato</span>
        <h2 id="t-contato" className="section-title">Visite a loja ou fale com a gente</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <ul className="card divide-y divide-ink/10">
            <li className="flex gap-4 p-5"><MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand-dark" /><div><p className="font-semibold">Endereço</p><address className="not-italic text-muted">{address}</address></div></li>
            <li className="flex gap-4 p-5"><Phone aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand-dark" /><div><p className="font-semibold">Telefone</p><a href={telUrl(s.phone)} className="text-muted underline-offset-2 hover:underline">{s.phone}</a></div></li>
            <li className="flex gap-4 p-5"><WhatsappIcon className="mt-1 h-5 w-5 shrink-0 text-brand-dark" /><div><p className="font-semibold">WhatsApp</p><a href={whatsappUrl(s.whatsapp, WA_MESSAGES.info)} {...ext} className="text-muted underline-offset-2 hover:underline">{formatWhatsapp(s.whatsapp)}</a></div></li>
            <li className="flex gap-4 p-5">
              <Clock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand-dark" />
              <div>
                <p className="font-semibold">Horário de funcionamento</p>
                {s.opening_hours.length > 0 ? (
                  <ul className="text-muted">{s.opening_hours.map((h) => <li key={h.label}>{h.label}: {h.hours}</li>)}</ul>
                ) : (
                  <p className="text-muted">Consulte nossos horários pelo WhatsApp ou telefone.</p>
                )}
                {s.hours_note && <p className="mt-1 text-sm text-muted">{s.hours_note}</p>}
              </div>
            </li>
          </ul>
          <div className="on-dark flex flex-col justify-between rounded-2xl bg-ink p-8 text-white">
            <div>
              <h3 className="font-display text-2xl font-semibold">Como chegar</h3>
              <p className="mt-3 text-white/75">{address}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={mapsUrl(MAPS_DESTINATION)} {...ext} className="btn btn-primary"><MapPin aria-hidden="true" className="h-5 w-5" /> Abrir no Google Maps</a>
              <a href={s.instagram_url} {...ext} className="btn btn-outline"><InstagramIcon /> Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
