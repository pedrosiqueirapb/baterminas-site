"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions/auth";

export function LoginForm({ accessDenied }: { accessDenied: boolean }) {
  const [state, action, pending] = useActionState(signIn, undefined);
  const error = state?.error ?? (accessDenied ? "Esta conta não possui autorização para acessar o painel." : undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-sm font-medium text-alert">{error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">{pending ? "Entrando..." : "Entrar"}</button>
    </form>
  );
}
