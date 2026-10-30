import Link from "next/link";
import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { getContentSafe } from "@/services/content";

export default async function NotFound() {
  const { settings } = await getContentSafe();
  return (
    <>
      <Header settings={settings} />
      <main className="container-page flex min-h-[50vh] flex-col items-start justify-center py-20">
        <p className="eyebrow">Erro 404</p>
        <h1 className="section-title">Página não encontrada</h1>
        <p className="mt-3 text-muted">O endereço que você acessou não existe ou foi movido.</p>
        <Link href="/" className="btn btn-primary mt-6">Voltar para a página inicial</Link>
      </main>
      <Footer s={settings} />
    </>
  );
}
