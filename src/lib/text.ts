/**
 * Regra de capitalização: só a primeira palavra começa com maiúscula.
 * Nomes próprios, marcas, siglas e URLs são preservados (lista permitida + heurística de siglas).
 */
export const PROTECTED_TERMS = [
  "Baterminas", "Autojade", "Uberlândia", "Minas", "Gerais", "Marta", "Helena", "Moura", "Zetta", "Varta", "Formax",
  "WhatsApp", "Instagram", "Google", "PIX", "Maps", "Av.", "Comendador", "Alexandrino", "Garcia", "MG", "Brasil",
];

const PROTECTED = new Set(PROTECTED_TERMS.map((t) => t.toLowerCase()));

function isExempt(word: string): boolean {
  const trimmed = word.replace(/^[^\p{L}\d]+|[^\p{L}\d.]+$/gu, "");
  if (!trimmed) return true;
  if (/^https?:\/\//i.test(trimmed) || /@|\d/.test(trimmed)) return true;
  const noDot = trimmed.replace(/\.+$/, "");
  const lower = trimmed.toLowerCase();
  if (PROTECTED.has(lower) || PROTECTED.has(noDot.toLowerCase())) return true;
  if (noDot.length >= 2 && noDot === noDot.toUpperCase() && noDot.length <= 6) return true;
  return false;
}

/** Retorna true se o texto respeita o padrão de capitalização. */
export function followsSentenceCase(text: string): boolean {
  const sentences = text.trim().split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).filter(Boolean);
    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      if (isExempt(w)) continue;
      const first = w.replace(/^[^\p{L}]+/u, "")[0];
      if (first && first === first.toUpperCase() && first !== first.toLowerCase()) return false;
    }
  }
  const letters = text.replace(/[^\p{L}]/gu, "");
  if (letters.length > 12 && letters === letters.toUpperCase()) return false;
  return true;
}

export const CAPITALIZATION_MESSAGE =
  "Use apenas a primeira letra da frase em maiúscula (exceto nomes próprios, marcas e siglas).";
