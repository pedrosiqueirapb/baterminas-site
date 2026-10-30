"use client";

import { createContext, useActionState, useContext, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ActionResult } from "@/types/content";

const ErrorsCtx = createContext<Record<string, string>>({});

type Action = (prev: ActionResult | undefined, fd: FormData) => Promise<ActionResult>;

export function SubmitButton({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "danger" | "dark" }) {
  const { pending } = useFormStatus();
  const cls = variant === "danger" ? "bg-alert text-white hover:bg-alert/90" : variant === "dark" ? "btn-dark" : "btn-primary";
  return (
    <button type="submit" disabled={pending} className={`btn ${cls} !min-h-11 !py-2 disabled:opacity-60`}>
      {pending ? "Salvando..." : children}
    </button>
  );
}

export function Feedback({ state }: { state?: ActionResult }) {
  if (!state) return null;
  const Icon = state.ok ? CheckCircle2 : AlertCircle;
  return (
    <p role={state.ok ? "status" : "alert"} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${state.ok ? "bg-green-100 text-green-900" : "bg-alert/10 text-alert"}`}>
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> {state.message}
    </p>
  );
}

export function AdminForm({
  action, children, submitLabel = "Salvar", className = "space-y-4", resetOnSuccess = false, confirmMessage, variant,
}: {
  action: Action; children: React.ReactNode;
  submitLabel?: string; className?: string; resetOnSuccess?: boolean; confirmMessage?: string; variant?: "primary" | "danger" | "dark";
}) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  return (
    <form
      ref={ref}
      action={formAction}
      className={className}
      onSubmit={(e) => { if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault(); }}
    >
      <ErrorsCtx.Provider value={errors}>{children}</ErrorsCtx.Provider>
      <Feedback state={state} />
      <SubmitButton variant={variant}>{submitLabel}</SubmitButton>
    </form>
  );
}

export function Field({ label, name, field, hint, children }: { label: string; name: string; field?: string; hint?: string; children: React.ReactNode }) {
  const error = useContext(ErrorsCtx)[field ?? name];
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${name}-erro`} role="alert" className="mt-1 text-sm text-alert">{error}</p>}
    </div>
  );
}

export function ImageInput({ name = "file" }: { name?: string }) {
  const error = useContext(ErrorsCtx)["file"];
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  return (
    <div>
      <input
        id={name} name={name} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="field"
        aria-describedby={`${name}-erro`}
        onChange={(e) => {
          const f = e.target.files?.[0];
          setLocalError(null);
          if (!f) return setPreview(null);
          if (f.size > 3 * 1024 * 1024) { e.target.value = ""; setPreview(null); return setLocalError("A imagem deve ter no máximo 3 MB."); }
          if (!/^image\/(jpeg|png|webp|avif)$/.test(f.type)) { e.target.value = ""; setPreview(null); return setLocalError("Formato inválido. Envie JPG, PNG, WebP ou AVIF."); }
          setPreview(URL.createObjectURL(f));
        }}
      />
      <p className="mt-1 text-xs text-muted">JPG, PNG, WebP ou AVIF, até 3 MB.</p>
      {(localError || error) && <p id={`${name}-erro`} role="alert" className="mt-1 text-sm text-alert">{localError ?? error}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {preview && <img src={preview} alt="Pré-visualização da nova imagem" width={240} height={180} className="mt-2 h-32 w-auto rounded-lg border border-ink/10 object-cover" />}
    </div>
  );
}

export function MoveButtons({ action, id, name }: { action: Action; id: string; name: string }) {
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="flex gap-1">
      <input type="hidden" name="id" value={id} />
      {(["up", "down"] as const).map((dir) => (
        <button key={dir} type="submit" name="dir" value={dir} aria-label={dir === "up" ? `Mover ${name} para cima` : `Mover ${name} para baixo`} className="btn btn-outline-dark !min-h-11 !min-w-11 !px-0 !py-0">
          <span aria-hidden="true">{dir === "up" ? "↑" : "↓"}</span>
        </button>
      ))}
      {state && !state.ok && <span role="alert" className="sr-only">{state.message}</span>}
    </form>
  );
}
