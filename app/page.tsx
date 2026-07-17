import { DailySummaryCard } from "@/components/steven/daily-summary-card";
import { StevenChat } from "@/components/steven/chat";
import { ASSISTANT_NAME } from "@/lib/ai/model";
import { generateDailySummary } from "@/lib/ai/daily-summary";

export default async function Home() {
  const summary = await generateDailySummary();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Admin Assistant</h1>
        <p className="text-muted-foreground">
          {ASSISTANT_NAME} reads real audit and payment data to answer questions, no generic
          chat wrapper.
        </p>
      </div>

      <DailySummaryCard summary={summary} />

      <StevenChat />
    </div>
  );
}
