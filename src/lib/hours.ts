/** Converte linhas "Seg a sex | 08:00 às 18:00" em estrutura de horários. */
export function parseHours(raw: string): { label: string; hours: string }[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [label, ...rest] = l.split("|");
      return { label: label.trim(), hours: rest.join("|").trim() };
    });
}

export function hoursToText(hours: { label: string; hours: string }[]): string {
  return hours.map((h) => `${h.label} | ${h.hours}`).join("\n");
}
