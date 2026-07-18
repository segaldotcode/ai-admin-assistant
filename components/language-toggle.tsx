"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function toggle() {
    const params = new URLSearchParams(searchParams);
    params.set("lang", locale === "en" ? "fr" : "en");
    router.push(`/?${params.toString()}`);
  }

  return (
    <Button
      variant="outline"
      size="icon"
      data-cuelume-toggle
      onClick={toggle}
      aria-label="Toggle language"
    >
      {locale === "en" ? "FR" : "EN"}
    </Button>
  );
}
