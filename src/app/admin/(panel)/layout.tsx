import type { Metadata } from "next";
import { LayoutDashboard, Settings, Tag, Layers, ImageIcon, ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions/auth";
import { Logo } from "@/components/public/logo";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: { default: "Painel", template: "%s | Painel Baterminas" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Início", icon: LayoutDashboard },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/marcas", label: "Marcas", icon: Tag },
  { href: "/admin/categorias", label: "Categorias", icon: Layers },
  { href: "/admin/imagens", label: "Imagens", icon: ImageIcon },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-paper">
      <header className="on-dark bg-ink text-white">
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={56} />
            <span className="hidden font-display font-semibold sm:block">Painel de administrador</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm hover:bg-white/10">
              <ExternalLink aria-hidden="true" className="h-4 w-4" /> Ver site
            </a>
            <form action={signOut}>
              <button type="submit" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm hover:bg-white/10">
                <LogOut aria-hidden="true" className="h-4 w-4" /> Sair
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Painel" className="border-t border-white/10">
          <ul className="container-page flex gap-1 overflow-x-auto py-2">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href} className="shrink-0">
                <a href={href} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-white/85 hover:bg-white/10 hover:text-brand">
                  <Icon aria-hidden="true" className="h-4 w-4" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="container-page py-8">
        {children}
      </main>
    </div>
  );
}
