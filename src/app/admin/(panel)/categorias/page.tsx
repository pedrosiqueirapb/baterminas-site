import type { Metadata } from "next";
import { moveCategory, saveCategory } from "@/app/admin/actions/content";
import { AdminForm, Field, ImageInput, MoveButtons } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { publicImageUrl } from "@/services/content";
import type { Category } from "@/types/content";

export const metadata: Metadata = { title: "Categorias" };

const DEFAULT_IMG: Record<string, string> = {
  carros: "/images/categoria-carros.webp", motos: "/images/categoria-motos.webp", caminhoes: "/images/categoria-caminhoes.webp",
  estacionarias: "/images/categoria-estacionarias.webp", nobreaks: "/images/categoria-nobreaks.webp",
};

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("battery_categories").select("*").order("sort_order").order("created_at");
  const items = (data ?? []) as Category[];
  return (
    <>
      <h1 className="section-title">Categorias</h1>
      <p className="mt-2 text-muted">Cartões da seção de aplicações. As cinco categorias iniciais podem ser editadas, reordenadas e despublicadas.</p>
      <ul className="mt-8 space-y-4">
        {items.map((c) => (
          <li key={c.id} className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={publicImageUrl(c.image_path) ?? DEFAULT_IMG[c.slug] ?? "/images/bateria-conceitual.webp"} alt="" width={64} height={48} className="h-12 w-16 rounded-md object-cover" />
                <div>
                  <h2 className="font-display text-lg font-semibold">{c.title}</h2>
                  <p className={`text-xs font-medium ${c.published ? "text-green-800" : "text-muted"}`}>{c.published ? "Publicada" : "Oculta"}</p>
                </div>
              </div>
              <MoveButtons action={moveCategory} id={c.id} name={c.title} />
            </div>
            <details>
              <summary className="cursor-pointer text-sm font-semibold underline-offset-2 hover:underline">Editar</summary>
              <AdminForm action={saveCategory} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={c.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Título" name={`${c.id}-title`} field="title"><input id={`${c.id}-title`} name="title" defaultValue={c.title} required className="field" /></Field>
                  <Field label="Posição na lista" name={`${c.id}-sort_order`} field="sort_order"><input id={`${c.id}-sort_order`} name="sort_order" type="number" min={0} defaultValue={c.sort_order} className="field" /></Field>
                  <div className="sm:col-span-2"><Field label="Descrição curta" name={`${c.id}-description`} field="description"><textarea id={`${c.id}-description`} name="description" rows={2} defaultValue={c.description} className="field" /></Field></div>
                  <Field label="Texto alternativo da imagem" name={`${c.id}-image_alt`} field="image_alt"><input id={`${c.id}-image_alt`} name="image_alt" defaultValue={c.image_alt} className="field" /></Field>
                  <Field label="Substituir imagem" name={`${c.id}-file`}><ImageInput /></Field>
                  <label className="flex min-h-11 items-center gap-3 sm:col-span-2"><input type="checkbox" name="published" defaultChecked={c.published} className="h-5 w-5 accent-brand" /> Categoria publicada</label>
                </div>
              </AdminForm>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
