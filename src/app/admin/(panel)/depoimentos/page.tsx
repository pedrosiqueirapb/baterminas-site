import type { Metadata } from "next";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/actions/content";
import { AdminForm, Field } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import type { Testimonial } from "@/types/content";

export const metadata: Metadata = { title: "Depoimentos" };

type Row = Testimonial & { authorized: boolean };

function Fields({ t }: { t?: Row }) {
  const p = t ? `${t.id}-` : "novo-";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {t && <input type="hidden" name="id" value={t.id} />}
      <Field label="Nome de exibição" name={`${p}display_name`} field="display_name" hint="Use apenas o nome autorizado pela pessoa."><input id={`${p}display_name`} name="display_name" defaultValue={t?.display_name} required className="field" /></Field>
      <Field label="Data (opcional)" name={`${p}testimonial_date`} field="testimonial_date"><input id={`${p}testimonial_date`} name="testimonial_date" type="date" defaultValue={t?.testimonial_date ?? ""} className="field" /></Field>
      <div className="sm:col-span-2"><Field label="Depoimento" name={`${p}body`} field="body"><textarea id={`${p}body`} name="body" rows={3} defaultValue={t?.body} required className="field" /></Field></div>
      <Field label="Origem" name={`${p}source`} field="source" hint="Depoimentos manuais nunca são identificados como Google.">
        <select id={`${p}source`} name="source" defaultValue={t?.source ?? "cliente_loja"} className="field">
          <option value="cliente_loja">Cliente da loja</option>
          <option value="site">Enviado pelo site</option>
        </select>
      </Field>
      <div className="space-y-1">
        <label className="flex min-h-11 items-center gap-3"><input type="checkbox" name="authorized" defaultChecked={t?.authorized} className="h-5 w-5 accent-brand" /> Tenho autorização para publicar</label>
        <label className="flex min-h-11 items-center gap-3"><input type="checkbox" name="published" defaultChecked={t?.published} className="h-5 w-5 accent-brand" /> Publicar no site</label>
        <p className="text-sm text-alert" aria-live="polite">{" "}</p>
      </div>
    </div>
  );
}

export default async function TestimonialsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false }).limit(100);
  const items = (data ?? []) as Row[];
  return (
    <>
      <h1 className="section-title">Depoimentos</h1>
      <p className="mt-2 max-w-2xl text-muted">Somente depoimentos autorizados podem ser publicados. Eles aparecem como depoimentos de clientes da loja, separados das avaliações do Google.</p>
      <ul className="mt-8 space-y-4">
        {items.map((t) => (
          <li key={t.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold">{t.display_name}</h2>
                <p className="text-sm text-muted">{t.body.slice(0, 120)}{t.body.length > 120 ? "..." : ""}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${t.published ? "bg-green-100 text-green-900" : "bg-ink/10 text-ink"}`}>{t.published ? "Publicado" : "Rascunho"}</span>
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold underline-offset-2 hover:underline">Editar</summary>
              <AdminForm action={saveTestimonial} className="mt-4 space-y-4"><Fields t={t} /></AdminForm>
              <AdminForm action={deleteTestimonial} className="mt-4" variant="danger" submitLabel="Excluir depoimento" confirmMessage="Excluir este depoimento? Esta ação não pode ser desfeita.">
                <input type="hidden" name="id" value={t.id} />
              </AdminForm>
            </details>
          </li>
        ))}
        {items.length === 0 && <li className="text-muted">Nenhum depoimento cadastrado.</li>}
      </ul>
      <section aria-labelledby="novo" className="card mt-10 p-6">
        <h2 id="novo" className="font-display text-xl font-semibold">Novo depoimento</h2>
        <AdminForm action={saveTestimonial} submitLabel="Criar depoimento" resetOnSuccess className="mt-4 space-y-4"><Fields /></AdminForm>
      </section>
    </>
  );
}
