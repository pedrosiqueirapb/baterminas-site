import type { Metadata } from "next";
import { deleteCategory, moveCategory, saveCategory } from "@/app/admin/actions/content";
import { AdminForm, EditDialog, Field, ImageInput, MoveButtons } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { publicImageUrl } from "@/services/content";
import type { Category } from "@/types/content";

export const metadata: Metadata = { title: "Categorias" };

const DEFAULT_IMG: Record<string, string> = {
  carros: "/images/categoria-carros.webp", motos: "/images/categoria-motos.webp", caminhoes: "/images/categoria-caminhoes.webp",
  estacionarias: "/images/categoria-estacionarias.webp", nobreaks: "/images/categoria-nobreaks.webp",
};

function CategoryFields({ c }: { c?: Category }) {
  const p = c ? `${c.id}-` : "nova-";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="sm:col-span-2"><Field label="Título" name={`${p}title`} field="title"><input id={`${p}title`} name="title" defaultValue={c?.title} required className="field" /></Field></div>
      <div className="sm:col-span-2"><Field label="Descrição curta" name={`${p}description`} field="description"><textarea id={`${p}description`} name="description" rows={2} defaultValue={c?.description} className="field" /></Field></div>
      <Field label="Texto alternativo da imagem" name={`${p}image_alt`} field="image_alt"><input id={`${p}image_alt`} name="image_alt" defaultValue={c?.image_alt} className="field" /></Field>
      <div className="sm:col-span-2"><Field label="Mensagem do WhatsApp" name={`${p}whatsapp_message`} field="whatsapp_message" hint="Texto enviado ao clicar no botão. Se ficar vazio, usa uma mensagem automática com o nome da categoria."><input id={`${p}whatsapp_message`} name="whatsapp_message" defaultValue={c?.whatsapp_message} maxLength={200} className="field" /></Field></div>
      <Field label={c ? "Substituir imagem" : "Imagem"} name={`${p}file`}><ImageInput id={`${p}file`} /></Field>
      <label className="flex min-h-11 items-center gap-3 sm:col-span-2"><input type="checkbox" name="published" defaultChecked={c?.published ?? true} className="h-5 w-5 accent-brand" /> Categoria publicada</label>
    </div>
  );
}

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("battery_categories").select("*").order("sort_order").order("created_at");
  const items = (data ?? []) as Category[];
  return (
    <>
      <h1 className="section-title">Categorias</h1>
      <p className="mt-2 text-muted">Cartões da seção de aplicações. Crie, edite, reordene, despublique ou exclua categorias.</p>
      <ul className="mt-8 space-y-4">
        {items.map((c) => (
          <li key={c.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={publicImageUrl(c.image_path) ?? DEFAULT_IMG[c.slug] ?? "/images/bateria-conceitual.webp"} alt="" width={64} height={48} className="h-12 w-16 rounded-md object-cover" />
                <div>
                  <h2 className="font-display text-lg font-semibold">{c.title}</h2>
                  <p className={`text-xs font-medium ${c.published ? "text-green-800" : "text-muted"}`}>{c.published ? "Publicada" : "Oculta"}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <EditDialog title={`Editar categoria ${c.title}`}>
                  <AdminForm action={saveCategory} className="space-y-4"><CategoryFields c={c} /></AdminForm>
                </EditDialog>
                <AdminForm action={deleteCategory} className="flex items-center gap-2" variant="danger" submitLabel="Excluir" iconOnly confirmMessage={`Excluir a categoria ${c.title}? Esta ação não pode ser desfeita.`}>
                  <input type="hidden" name="id" value={c.id} />
                </AdminForm>
                <MoveButtons action={moveCategory} id={c.id} name={c.title} />
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="text-muted">Nenhuma categoria cadastrada.</li>}
      </ul>

      <section aria-labelledby="nova" className="card mt-10 p-6">
        <h2 id="nova" className="font-display text-xl font-semibold">Nova categoria</h2>
        <AdminForm action={saveCategory} submitLabel="Criar categoria" resetOnSuccess className="mt-4 space-y-4"><CategoryFields /></AdminForm>
      </section>
    </>
  );
}
