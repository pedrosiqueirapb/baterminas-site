import type { Metadata } from "next";
import { resetSiteImage, uploadSiteImage } from "@/app/admin/actions/content";
import { AdminForm, Field, ImageInput } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { publicImageUrl } from "@/services/content";

export const metadata: Metadata = { title: "Imagens" };

const SLOTS = [
  { slot: "logo", title: "Logo do site", column: "logo_path", fallback: "/logo.png", hint: "Mantenha a proporção original. Use a logo oficial da Baterminas." },
  { slot: "hero", title: "Imagem principal", column: "hero_image_path", fallback: "/images/hero-carro-estrada.webp", hint: "Horizontal, com espaço livre à esquerda para o texto. Textos alternativos são editados em Configurações." },
  { slot: "about", title: "Imagem da seção sobre a loja", column: "about_image_path", fallback: "/images/sobre-bancada-ferramentas.webp", hint: "Prefira fotos reais da loja, se houver autorização de uso." },
] as const;

export default async function ImagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("logo_path,hero_image_path,about_image_path").eq("id", 1).maybeSingle();
  const row = (data ?? {}) as Record<string, string>;
  return (
    <>
      <h1 className="section-title">Imagens</h1>
      <p className="mt-2 text-muted">Imagens de marcas e categorias são enviadas nas respectivas páginas.</p>
      <ul className="mt-8 grid gap-5 lg:grid-cols-3">
        {SLOTS.map((s) => {
          const current = row[s.column];
          return (
            <li key={s.slot} className="card flex flex-col gap-4 p-5">
              <h2 className="font-display text-lg font-semibold">{s.title}</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={publicImageUrl(current) ?? s.fallback} alt={`Imagem atual: ${s.title}`} width={400} height={300} className="h-40 w-full rounded-lg border border-ink/10 bg-ink/5 object-contain" />
              <p className="text-xs text-muted">{current ? "Imagem personalizada em uso." : "Imagem padrão em uso."} {s.hint}</p>
              <AdminForm action={uploadSiteImage} submitLabel="Enviar e publicar" className="space-y-3">
                <input type="hidden" name="slot" value={s.slot} />
                <Field label="Nova imagem" name={`${s.slot}-file`}><ImageInput id={`${s.slot}-file`} /></Field>
              </AdminForm>
              {current && (
                <AdminForm action={resetSiteImage} submitLabel="Restaurar padrão" variant="dark" confirmMessage="Restaurar a imagem padrão? O arquivo enviado será removido.">
                  <input type="hidden" name="slot" value={s.slot} />
                </AdminForm>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
