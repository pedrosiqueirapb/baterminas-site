"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/brand-icons";

export type NavItem = { href: string; label: string };

export function MobileMenu({ items, whatsappHref }: { items: NavItem[]; whatsappHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-movel"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-xl text-white hover:bg-white/10"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open && (
        <nav id="menu-movel" aria-label="Menu principal" className="absolute inset-x-0 top-full border-t border-white/10 bg-ink px-5 pb-6 pt-3 shadow-lg">
          <ul className="flex flex-col">
            {items.map((i) => (
              <li key={i.href}>
                <a href={i.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3.5 text-lg text-white hover:bg-white/10">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4 w-full">
            <WhatsappIcon /> Fale pelo WhatsApp
          </a>
        </nav>
      )}
    </div>
  );
}
