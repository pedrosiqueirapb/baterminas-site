import type { OpeningHour } from "@/types/content";

/** Junta as listas enviadas pelo formulário e descarta períodos totalmente vazios. */
export function collectHours(labels: string[], values: string[]): OpeningHour[] {
  return labels
    .map((label, i) => ({ label: label.trim(), hours: (values[i] ?? "").trim() }))
    .filter((row) => row.label !== "" || row.hours !== "");
}
