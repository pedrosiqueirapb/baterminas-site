import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/public/logo";

export const metadata: Metadata = { title: "Entrar no painel", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size={104} />
          <h1 className="font-display text-2xl font-bold">Painel de administrador</h1>
        </div>
        <LoginForm accessDenied={erro === "acesso"} />
        <Link href="/" className="mt-6 block text-center text-sm font-semibold underline underline-offset-4 hover:text-brand-dark">Voltar para a página principal</Link>
      </div>
    </main>
  );
}
