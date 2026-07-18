import { DailySummaryCard } from "@/components/steven/daily-summary-card";
import { PaymentExplainer } from "@/components/steven/payment-explainer";
import { StevenChat } from "@/components/steven/chat";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateDailySummary } from "@/lib/ai/daily-summary";
import { getRecentProblemPayments } from "@/lib/data/payments";
import { getDictionary, type Locale } from "@/lib/i18n";

interface HomeProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const locale: Locale = params.lang === "fr" ? "fr" : "en";
  const dict = getDictionary(locale);

  const [summary, problemPayments] = await Promise.all([
    generateDailySummary(locale),
    getRecentProblemPayments(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle locale={locale} />
        </div>
      </header>

      <DailySummaryCard dict={dict} summary={summary} />

      <PaymentExplainer dict={dict} locale={locale} payments={problemPayments} />

      <StevenChat dict={dict} locale={locale} />
    </div>
  );
}
