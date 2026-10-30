"use client";

import { useActionState, useState } from "react";
import { enrollTotp, signOut, verifyTotp } from "@/app/admin/actions/auth";

type Initial = { step: "verify"; factorId: string } | { step: "enroll" } | { step: "done" };

function CodeForm({ factorId }: { factorId: string }) {
  const [state, action, pending] = useActionState(verifyTotp, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="factorId" value={factorId} />
      <div>
        <label htmlFor="code" className="label">Código do aplicativo autenticador</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required className="field text-center text-xl tracking-[0.4em]" />
      </div>
      {state?.error && <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-sm font-medium text-alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">{pending ? "Verificando..." : "Verificar"}</button>
    </form>
  );
}

export function MfaPanel({ initial }: { initial: Initial }) {
  const [enroll, setEnroll] = useState<{ factorId: string; qrSvg: string; secret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-5">
      {initial.step === "verify" && (
        <>
          <p className="text-sm text-muted">Digite o código de 6 dígitos gerado no seu aplicativo autenticador.</p>
          <CodeForm factorId={initial.factorId} />
        </>
      )}
      {initial.step === "enroll" && !enroll && (
        <>
          <p className="text-sm text-muted">Para proteger o painel, configure um aplicativo autenticador (Google Authenticator, Microsoft Authenticator ou similar).</p>
          {error && <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>}
          <button
            type="button" disabled={loading} className="btn btn-primary w-full"
            onClick={async () => {
              setLoading(true); setError(null);
              const r = await enrollTotp();
              setLoading(false);
              if ("error" in r) setError(r.error); else setEnroll(r);
            }}
          >
            {loading ? "Gerando..." : "Configurar segundo fator"}
          </button>
        </>
      )}
      {initial.step === "enroll" && enroll && (
        <>
          <p className="text-sm text-muted">Leia o QR code no aplicativo e informe o código gerado.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enroll.qrSvg} alt="QR code para configurar o aplicativo autenticador" width={192} height={192} className="mx-auto h-48 w-48" />
          <p className="break-all rounded-lg bg-paper p-3 text-center font-mono text-xs">
            <span className="block text-muted">Ou digite esta chave manualmente:</span>{enroll.secret}
          </p>
          <CodeForm factorId={enroll.factorId} />
        </>
      )}
      <form action={signOut}><button type="submit" className="w-full text-center text-sm text-muted underline">Sair</button></form>
    </div>
  );
}
