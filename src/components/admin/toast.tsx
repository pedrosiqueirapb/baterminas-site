"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { ActionResult } from "@/types/content";

type Toast = ActionResult & { id: number };

const ToastCtx = createContext<(result: ActionResult) => void>(() => {});

/** Exibe o resultado de uma ação do painel (sucesso ou erro). */
export function useToast() {
  return useContext(ToastCtx);
}

const DURATION_MS = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const notify = useCallback((result: ActionResult) => {
    const id = ++nextId.current;
    setToasts((list) => [...list.slice(-2), { ...result, id }]);
  }, []);

  return (
    <ToastCtx.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);
  const Icon = toast.ok ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={toast.ok ? "status" : "alert"}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ring-1 ${toast.ok ? "bg-green-50 text-green-900 ring-green-200" : "bg-white text-alert ring-alert/30"}`}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="flex-1">{toast.message}</p>
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Fechar aviso" className="-m-1 rounded p-1 opacity-70 hover:opacity-100">
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
