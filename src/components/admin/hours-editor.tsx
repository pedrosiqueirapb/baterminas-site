"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { OpeningHour } from "@/types/content";

const MAX_ROWS = 10;

/** Editor de horários: uma linha por período (dias + horário), enviada como `hours_label` e `hours_value`. */
export function HoursEditor({ initial }: { initial: OpeningHour[] }) {
  const [rows, setRows] = useState<OpeningHour[]>(initial.length > 0 ? initial : [{ label: "", hours: "" }]);
  const update = (index: number, patch: Partial<OpeningHour>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-wrap items-end gap-3">
          <label className="min-w-40 flex-1">
            <span className="label">Dias</span>
            <input name="hours_label" value={row.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Segunda a sexta" maxLength={40} className="field" />
          </label>
          <label className="min-w-40 flex-1">
            <span className="label">Horário</span>
            <input name="hours_value" value={row.hours} onChange={(e) => update(i, { hours: e.target.value })} placeholder="08:00 às 18:00" maxLength={40} className="field" />
          </label>
          <button type="button" aria-label={`Remover período ${i + 1}`} onClick={() => setRows((c) => c.filter((_, k) => k !== i))} className="btn btn-outline-dark !min-h-11 !min-w-11 !px-0 !py-0">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      ))}
      {rows.length < MAX_ROWS && (
        <button type="button" onClick={() => setRows((c) => [...c, { label: "", hours: "" }])} className="btn btn-outline-dark !min-h-11 !py-2">
          <Plus aria-hidden="true" className="h-4 w-4" /> Adicionar período
        </button>
      )}
    </div>
  );
}
