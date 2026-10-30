import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMfaState } from "@/app/admin/actions/auth";
import { MfaPanel } from "@/components/admin/mfa-panel";
import { Logo } from "@/components/public/logo";

export const metadata: Metadata = { title: "Verificação em duas etapas", robots: { index: false, follow: false } };

export default async function MfaPage() {
  const state = await getMfaState();
  if (state.step === "done") redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size={64} />
          <h1 className="font-display text-2xl font-bold">Verificação em duas etapas</h1>
        </div>
        <MfaPanel initial={state} />
      </div>
    </main>
  );
}
