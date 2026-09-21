export const HOME_STUDIO_LENS_EVENT = "branding-tatva:home-studio-lens";
export const HOME_STUDIO_LENS_STORAGE_KEY = "branding-tatva:home-studio-lens:v2";

export type HomeStudioLensName = "Psychology" | "Literature" | "Strategy";

export type HomeStudioLens = {
  name: HomeStudioLensName;
  question: string;
  accent: string;
};

export type HomeStudioLensDetail = {
  lens: HomeStudioLens | null;
};

export const HOME_STUDIO_LENSES = [
  {
    name: "Psychology",
    question: "Which hidden tension is shaping this choice?",
    accent: "#a86645",
  },
  {
    name: "Literature",
    question: "Which meaning should people recognise and repeat?",
    accent: "#527687",
  },
  {
    name: "Strategy",
    question: "Which decision should every output obey?",
    accent: "#9c6f26",
  },
] as const satisfies ReadonlyArray<HomeStudioLens>;

export function isHomeStudioLens(value: unknown): value is HomeStudioLens {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<HomeStudioLens>;
  return HOME_STUDIO_LENSES.some(
    (lens) =>
      lens.name === candidate.name &&
      lens.question === candidate.question &&
      lens.accent === candidate.accent,
  );
}

export function readHomeStudioLens(): HomeStudioLens | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.sessionStorage.getItem(HOME_STUDIO_LENS_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isHomeStudioLens(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function publishHomeStudioLens(lens: HomeStudioLens) {
  if (typeof window === "undefined" || !isHomeStudioLens(lens)) return;
  try {
    window.sessionStorage.setItem(HOME_STUDIO_LENS_STORAGE_KEY, JSON.stringify(lens));
  } catch {}
  window.dispatchEvent(
    new CustomEvent<HomeStudioLensDetail>(HOME_STUDIO_LENS_EVENT, {
      detail: { lens },
    }),
  );
}

export function clearHomeStudioLens() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(HOME_STUDIO_LENS_STORAGE_KEY);
  } catch {}
  window.dispatchEvent(
    new CustomEvent<HomeStudioLensDetail>(HOME_STUDIO_LENS_EVENT, {
      detail: { lens: null },
    }),
  );
}
