import { Logo } from "@/components/public/logo";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/brand-icons";
import { AUTOJADE_URL } from "@/lib/constants";
import { WA_MESSAGES, telUrl, whatsappUrl } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types/content";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer({ s, showReviewsLink }: { s: SiteSettings; showReviewsLink?: boolean }) {
  return (
    <footer className="on-dark bg-ink pb-24 pt-14 text-white/80 lg:pb-10">
      <div className="container-page grid gap-10 md:grid-cols-3">
        <div>
          <Logo path={s.logo_path} size={72} />
          <address className="mt-4 text-[0.95rem] not-italic">
            {s.address_line} - {s.neighborhood}, {s.city} - {s.state}
          </address>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="mb-3 font-display text-base font-semibold text-white">Navegação</h2>
          <ul className="space-y-2 text-[0.95rem]">
            {[["/#baterias", "Baterias"], ["/#marcas", "Marcas"], ...(s.show_reviews && showReviewsLink !== false ? [["/#avaliacoes", "Avaliações"]] : []), ["/#contato", "Localização e contato"], ["/privacidade", "Política de privacidade"], ["/termos", "Termos de uso"]].map(([href, label]) => (
              <li key={href}><a href={href} className="hover:text-brand">{label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 font-display text-base font-semibold text-white">Contato</h2>
          <ul className="space-y-3 text-[0.95rem]">
            <li><a href={telUrl(s.phone)} className="hover:text-brand">{s.phone}</a></li>
            <li><a href={whatsappUrl(s.whatsapp, WA_MESSAGES.info)} {...ext} className="inline-flex items-center gap-2 hover:text-brand"><WhatsappIcon /> WhatsApp</a></li>
            <li><a href={s.instagram_url} {...ext} className="inline-flex items-center gap-2 hover:text-brand"><InstagramIcon /> Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="container-page mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm sm:flex-row sm:justify-between">
        <p>{s.footer_copyright}</p>
        <p>
          Desenvolvido por{" "}
          <a href={AUTOJADE_URL} {...ext} className="font-semibold text-brand underline-offset-2 hover:underline">Autojade</a>
        </p>
      </div>
    </footer>
  );
}

export function FloatingWhatsapp({ s }: { s: SiteSettings }) {
  return (
    <a
      href={whatsappUrl(s.whatsapp, WA_MESSAGES.general)}
      {...ext}
      aria-label="Fale pelo WhatsApp"
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855] text-white shadow-lg ring-2 ring-white hover:bg-[#188a46] lg:hidden"
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
