import { Logo } from "@/components/public/logo";
import { MobileMenu, type NavItem } from "@/components/public/mobile-menu";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { whatsappUrl } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types/content";

export function Header({ settings }: { settings: SiteSettings }) {
  const items: NavItem[] = [
    { href: "/#baterias", label: "Baterias" },
    { href: "/#marcas", label: "Marcas" },
    { href: "/#contato", label: "Localização e contato" },
  ];
  const wa = whatsappUrl(settings.whatsapp);
  return (
    <header className="on-dark sticky top-0 z-40 border-b border-white/10 bg-ink text-white">
      <div className="container-page relative flex h-20 items-center justify-between sm:h-24 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center">
          <Logo path={settings.logo_path} size={72} />
        </div>
        <nav aria-label="Menu principal" className="hidden items-center gap-10 lg:flex">
          {items.map((i) => (
            <a key={i.href} href={i.href} className="whitespace-nowrap text-[0.95rem] font-medium text-white/85 transition-colors hover:text-brand">
              {i.label}
            </a>
          ))}
        </nav>
        <div className="hidden justify-end lg:flex">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11 !py-2 whitespace-nowrap">
            <WhatsappIcon /> Fale pelo WhatsApp
          </a>
        </div>
        <MobileMenu items={items} whatsappHref={wa} />
      </div>
    </header>
  );
}
