"use client";

import { Children, cloneElement, isValidElement, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Lista em grade que mostra só os primeiros `limit` itens e oferece "Ver mais" / "Ver menos".
 * Os botões só aparecem quando há mais itens que o limite. Todos os itens são renderizados no
 * servidor (bom para SEO); os excedentes ficam apenas ocultos até o visitante expandir.
 */
export function ExpandableList({ limit, className, children }: { limit: number; className: string; children: React.ReactNode }) {
  const items = Children.toArray(children);
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const hasMore = items.length > limit;

  const toggle = () => {
    if (expanded) {
      const top = listRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setExpanded((v) => !v);
  };

  return (
    <>
      <ul id={listId} ref={listRef} className={`${className} scroll-mt-28`}>
        {items.map((item, i) =>
          hasMore && !expanded && i >= limit && isValidElement<{ hidden?: boolean }>(item) ? cloneElement(item, { hidden: true }) : item,
        )}
      </ul>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={toggle} aria-expanded={expanded} aria-controls={listId} className="btn btn-outline-dark">
            {expanded ? "Ver menos" : "Ver mais"}
            <ChevronDown aria-hidden="true" className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </>
  );
}
