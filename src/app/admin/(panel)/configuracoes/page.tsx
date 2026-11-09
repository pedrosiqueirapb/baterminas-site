import type { Metadata } from "next";
import { saveSettings } from "@/app/admin/actions/content";
import { AdminForm, Field } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { FALLBACK_SETTINGS } from "@/lib/constants";
import { HoursEditor } from "@/components/admin/hours-editor";
import type { SiteSettings } from "@/types/content";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const s = { ...FALLBACK_SETTINGS, ...(data as Partial<SiteSettings> | null) };

  return (
    <>
      <h1 className="section-title">Configurações</h1>
      <AdminForm action={saveSettings} submitLabel="Salvar e publicar" className="mt-8 space-y-8">
        <>
            <fieldset className="card grid gap-4 p-6 sm:grid-cols-2">
              <legend className="px-2 font-display font-semibold">Contato</legend>
              <Field label="Nome comercial" name="business_name"><input id="business_name" name="business_name" defaultValue={s.business_name} className="field" required /></Field>
              <Field label="Telefone fixo" name="phone"><input id="phone" name="phone" defaultValue={s.phone} className="field" required /></Field>
              <Field label="WhatsApp (com DDD)" name="whatsapp" hint="Exemplo: 34 99995-4450"><input id="whatsapp" name="whatsapp" defaultValue={s.whatsapp} className="field" required /></Field>
              <Field label="Link do Instagram" name="instagram_url"><input id="instagram_url" name="instagram_url" type="url" defaultValue={s.instagram_url} className="field" required /></Field>
              <Field label="Link do perfil no Google (opcional)" name="google_profile_url" hint="Link oficial do perfil da empresa no Google."><input id="google_profile_url" name="google_profile_url" type="url" defaultValue={s.google_profile_url} className="field" /></Field>
            </fieldset>

            <fieldset className="card grid gap-4 p-6 sm:grid-cols-2">
              <legend className="px-2 font-display font-semibold">Endereço e horários</legend>
              <Field label="Endereço" name="address_line"><input id="address_line" name="address_line" defaultValue={s.address_line} className="field" required /></Field>
              <Field label="Complemento" name="address_complement"><input id="address_complement" name="address_complement" defaultValue={s.address_complement} className="field" /></Field>
              <Field label="Bairro" name="neighborhood"><input id="neighborhood" name="neighborhood" defaultValue={s.neighborhood} className="field" required /></Field>
              <Field label="Cidade" name="city"><input id="city" name="city" defaultValue={s.city} className="field" required /></Field>
              <Field label="Estado (sigla)" name="state"><input id="state" name="state" maxLength={2} defaultValue={s.state} className="field" required /></Field>
              <Field label="CEP (opcional)" name="postal_code"><input id="postal_code" name="postal_code" defaultValue={s.postal_code} className="field" /></Field>
              <div className="sm:col-span-2">
                <Field label="Horário de funcionamento" name="opening_hours" hint="Deixe em branco para não exibir horários."><HoursEditor initial={s.opening_hours} /></Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Observação sobre horários (opcional)" name="hours_note"><input id="hours_note" name="hours_note" defaultValue={s.hours_note} className="field" /></Field>
              </div>
            </fieldset>

            <fieldset className="card grid gap-4 p-6">
              <legend className="px-2 font-display font-semibold">Textos da página inicial</legend>
              <Field label="Título principal" name="hero_title"><input id="hero_title" name="hero_title" defaultValue={s.hero_title} className="field" required /></Field>
              <Field label="Descrição principal" name="hero_description"><textarea id="hero_description" name="hero_description" rows={2} defaultValue={s.hero_description} className="field" required /></Field>
              <Field label="Texto alternativo da imagem principal" name="hero_image_alt"><input id="hero_image_alt" name="hero_image_alt" defaultValue={s.hero_image_alt} className="field" /></Field>
              <Field label="Título da seção sobre a loja" name="about_title"><input id="about_title" name="about_title" defaultValue={s.about_title} className="field" required /></Field>
              <Field label="Texto da seção sobre a loja" name="about_text"><textarea id="about_text" name="about_text" rows={3} defaultValue={s.about_text} className="field" required /></Field>
              <Field label="Texto alternativo da imagem da seção sobre a loja" name="about_image_alt"><input id="about_image_alt" name="about_image_alt" defaultValue={s.about_image_alt} className="field" /></Field>
              <Field label="Título da chamada final" name="cta_title"><input id="cta_title" name="cta_title" defaultValue={s.cta_title} className="field" required /></Field>
              <Field label="Descrição da chamada final" name="cta_description"><textarea id="cta_description" name="cta_description" rows={2} defaultValue={s.cta_description} className="field" required /></Field>
              <Field label="Texto de direitos autorais" name="footer_copyright"><input id="footer_copyright" name="footer_copyright" defaultValue={s.footer_copyright} className="field" required /></Field>
            </fieldset>

            <fieldset className="card grid gap-4 p-6">
              <legend className="px-2 font-display font-semibold">SEO</legend>
              <Field label="Título da página (até 70 caracteres)" name="seo_title"><input id="seo_title" name="seo_title" maxLength={70} defaultValue={s.seo_title} className="field" required /></Field>
              <Field label="Descrição para buscadores (até 170 caracteres)" name="seo_description"><textarea id="seo_description" name="seo_description" maxLength={170} rows={3} defaultValue={s.seo_description} className="field" required /></Field>
            </fieldset>

            <fieldset className="card space-y-3 p-6">
              <legend className="px-2 font-display font-semibold">Seções opcionais</legend>
              <label className="flex min-h-11 items-center gap-3"><input type="checkbox" name="show_about" defaultChecked={s.show_about} className="h-5 w-5 accent-brand" /> Exibir a seção sobre a loja</label>
            </fieldset>
          </>
      </AdminForm>
    </>
  );
}
