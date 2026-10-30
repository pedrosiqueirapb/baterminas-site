import Link from "next/link";
import { Logo } from "@/components/public/logo";
import { MobileMenu, type NavItem } from "@/components/public/mobile-menu";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { WA_MESSAGES, whatsappUrl } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types/content";

export function Header({ settings }: { settings: SiteSettings }) {
  const items: NavItem[] = [
    { href: "/#baterias", label: "Baterias" },
    { href: "/#marcas", label: "Marcas" },
    ...(settings.show_reviews ? [{ href: "/#avaliacoes", label: "Avaliações" }] : []),
    { href: "/#contato", label: "Localização e contato" },
  ];
  const wa = whatsappUrl(settings.whatsapp, WA_MESSAGES.general);
  return (
    <header className="on-dark sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
      <div className="container-page relative flex h-16 items-center justify-between sm:h-20">
        <Link href="/" aria-label="Baterminas, página inicial" className="flex items-center">
          <Logo path={settings.logo_path} size={48} />
        </Link>
        <nav aria-label="Menu principal" className="hidden items-center gap-8 lg:flex">
          {items.map((i) => (
            <a key={i.href} href={i.href} className="text-[0.95rem] font-medium text-white/85 hover:text-brand">
              {i.label}
            </a>
          ))}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11 !py-2">
            <WhatsappIcon /> Fale pelo WhatsApp
          </a>
        </nav>
        <MobileMenu items={items} whatsappHref={wa} />
      </div>
    </header>
  );
}
