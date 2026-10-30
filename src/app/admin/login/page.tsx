import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/public/logo";

export const metadata: Metadata = { title: "Entrar no painel", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size={72} />
          <h1 className="font-display text-2xl font-bold">Painel administrativo</h1>
          <p className="text-sm text-muted">Acesso restrito à equipe autorizada.</p>
        </div>
        <LoginForm accessDenied={erro === "acesso"} />
      </div>
    </main>
  );
}
