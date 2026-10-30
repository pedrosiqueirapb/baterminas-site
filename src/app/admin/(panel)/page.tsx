import { requireAdmin } from "@/lib/auth";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const [b, c, t] = await Promise.all([
    supabase.from("battery_brands").select("id", { count: "exact", head: true }),
    supabase.from("battery_categories").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
  ]);
  const cards = [
    { href: "/admin/configuracoes", title: "Configurações", text: "Contatos, endereço, horários, textos e SEO." },
    { href: "/admin/marcas", title: "Marcas", text: `${b.count ?? 0} cadastradas. Criar, editar, ordenar e ativar.` },
    { href: "/admin/categorias", title: "Categorias", text: `${c.count ?? 0} cadastradas. Textos, imagens e ordem.` },
    { href: "/admin/imagens", title: "Imagens", text: "Logo, imagem principal e imagem da seção sobre." },
    { href: "/admin/depoimentos", title: "Depoimentos", text: `${t.count ?? 0} cadastrados. Somente com autorização.` },
  ];
  return (
    <>
      <h1 className="section-title">Bem-vindo ao painel</h1>
      <p className="mt-2 text-muted">As alterações são publicadas no site assim que você salva. Use &ldquo;Ver site&rdquo; para conferir o resultado.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <a href={c.href} className="card block h-full p-6 transition-colors hover:border-brand">
              <h2 className="font-display text-lg font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm text-muted">{c.text}</p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
