import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ExpandableList } from "@/components/public/expandable-list";

const render = (count: number) =>
  renderToStaticMarkup(
    h(ExpandableList, { limit: 6, className: "grid", children: Array.from({ length: count }, (_, i) => h("li", { key: i }, `Card ${i + 1}`)) }),
  );

describe("lista expansível da seção Aplicações", () => {
  it("não mostra o botão com até 6 cards", () => {
    const html = render(6);
    expect(html).not.toContain("Ver mais");
    expect(html).not.toContain("hidden");
  });

  it("com mais de 6 cards, oculta os excedentes e mostra \"Ver mais\"", () => {
    const html = render(8);
    expect(html).toContain("Ver mais");
    expect(html).toContain('aria-expanded="false"');
    expect(html.match(/<li hidden="">/g)).toHaveLength(2);
    expect(html).toContain("Card 8");
  });
});
