"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrossel circular: setas rolam um cartão por vez e, no fim, voltam ao início (e vice-versa).
 * As setas só aparecem quando os cartões não cabem na tela.
 */
export function Carousel({ label, children, dark = false }: { label: string; children: React.ReactNode; dark?: boolean }) {
  const track = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (el) setOverflow(el.scrollWidth > el.clientWidth + 4);
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, children]);

  function go(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior });
    else el.scrollBy({ left: dir * step, behavior });
  }

  const arrow = dark
    ? "border-white/30 text-white hover:bg-white/10"
    : "border-ink/20 text-ink hover:bg-ink/5";

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={label}>
      <ul
        ref={track}
        className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      {overflow && (
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label="Anterior" className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${arrow}`}>
            <ChevronLeft aria-hidden="true" className="h-6 w-6" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Próximo" className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${arrow}`}>
            <ChevronRight aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
