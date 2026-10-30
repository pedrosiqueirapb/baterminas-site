import type { Metadata } from "next";
import { deleteBrand, moveBrand, saveBrand } from "@/app/admin/actions/content";
import { AdminForm, EditDialog, Field, ImageInput, MoveButtons } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { publicImageUrl } from "@/services/content";
import type { Brand } from "@/types/content";

export const metadata: Metadata = { title: "Marcas" };

function BrandFields({ b }: { b?: Brand }) {
  const p = b ? `${b.id}-` : "novo-";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {b && <input type="hidden" name="id" value={b.id} />}
      <Field label="Nome da marca" name={`${p}name`} field="name"><input id={`${p}name`} name="name" defaultValue={b?.name} required className="field" /></Field>
      <div className="sm:col-span-2"><Field label="Descrição curta" name={`${p}description`} field="description"><textarea id={`${p}description`} name="description" rows={2} defaultValue={b?.description} className="field" /></Field></div>
      <Field label="Texto alternativo da imagem" name={`${p}image_alt`} field="image_alt"><input id={`${p}image_alt`} name="image_alt" defaultValue={b?.image_alt} className="field" /></Field>
      <Field label={b ? "Substituir imagem" : "Imagem"} name={`${p}file`}><ImageInput /></Field>
      <label className="flex min-h-11 items-center gap-3 sm:col-span-2"><input type="checkbox" name="active" defaultChecked={b?.active ?? true} className="h-5 w-5 accent-brand" /> Marca ativa (visível no site)</label>
    </div>
  );
}

export default async function BrandsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("battery_brands").select("*").order("sort_order").order("created_at");
  const brands = (data ?? []) as Brand[];
  return (
    <>
      <h1 className="section-title">Marcas</h1>
      <p className="mt-2 text-muted">Cartões exibidos na seção de marcas do site.</p>

      <ul className="mt-8 space-y-4">
        {brands.map((b) => (
          <li key={b.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={publicImageUrl(b.image_path) ?? "/images/bateria-conceitual.webp"} alt="" width={64} height={48} className="h-12 w-16 rounded-md object-cover" />
                <div>
                  <h2 className="font-display text-lg font-semibold">{b.name}</h2>
                  <p className={`text-xs font-medium ${b.active ? "text-green-800" : "text-muted"}`}>{b.active ? "Ativa" : "Inativa"}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <EditDialog title={`Editar marca ${b.name}`}>
                  <AdminForm action={saveBrand} className="space-y-4"><BrandFields b={b} /></AdminForm>
                </EditDialog>
                <AdminForm action={deleteBrand} className="flex items-center gap-2" variant="danger" submitLabel="Excluir" confirmMessage={`Excluir a marca ${b.name}? Esta ação não pode ser desfeita.`}>
                  <input type="hidden" name="id" value={b.id} />
                </AdminForm>
                <MoveButtons action={moveBrand} id={b.id} name={b.name} />
              </div>
            </div>
          </li>
        ))}
        {brands.length === 0 && <li className="text-muted">Nenhuma marca cadastrada.</li>}
      </ul>

      <section aria-labelledby="nova" className="card mt-10 p-6">
        <h2 id="nova" className="font-display text-xl font-semibold">Nova marca</h2>
        <AdminForm action={saveBrand} submitLabel="Criar marca" resetOnSuccess className="mt-4 space-y-4"><BrandFields /></AdminForm>
      </section>
    </>
  );
}
