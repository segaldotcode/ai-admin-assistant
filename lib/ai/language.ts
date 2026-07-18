import type { Locale } from "@/lib/i18n";

export function languageName(locale: Locale): string {
  return locale === "fr" ? "French" : "English";
}
