import { Footer, FloatingWhatsapp } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { getContentSafe } from "@/services/content";

export async function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  const { settings } = await getContentSafe();
  return (
    <>
      <Header settings={settings} />
      <main className="container-page max-w-3xl py-14 sm:py-20">
        <h1 className="section-title">{title}</h1>
        <p className="mt-2 text-sm text-muted">Atualizado em {updated}</p>
        <div className="mt-8 space-y-6 text-[1.02rem] leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <Footer s={settings} />
      <FloatingWhatsapp s={settings} />
    </>
  );
}
