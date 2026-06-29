export const DEFAULT_LOCALE = "en" as const;

export type Locale = "en" | "fa" | "ar";

const RTL_LOCALES: Locale[] = ["fa", "ar"];

export function getDir(locale: Locale) {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

// فقط home.json فعلا
const homeDictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import("@/locales/en/home.json").then((m) => m.default),
  fa: () => import("@/locales/fa/home.json").then((m) => m.default),
  ar: () => import("@/locales/ar/home.json").then((m) => m.default),
};

export async function getHomeDict(locale: Locale) {
  try {
    return await homeDictionaries[locale]();
  } catch {
    return await homeDictionaries.en();
  }
}

// اگر بعدا خواستی کلید string بدی: t(dict,"hero.title")
export function t(dict: any, key: string, fallback = ""): string {
  const parts = key.split(".");
  let cur = dict;

  for (const p of parts) {
    cur = cur?.[p];
    if (cur === undefined || cur === null) return fallback;
  }

  return typeof cur === "string" ? cur : fallback;
}
