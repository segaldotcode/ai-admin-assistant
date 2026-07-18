import en from "@/lib/i18n/en.json";
import fr from "@/lib/i18n/fr.json";

export type Locale = "en" | "fr";

export const dictionaries = { en, fr } satisfies Record<Locale, typeof en>;

export type Dictionary = typeof en;

export function getDictionary(locale: string | undefined): Dictionary {
  return locale === "fr" ? dictionaries.fr : dictionaries.en;
}
