import { countSuspiciousLoginBursts } from "@/lib/data/audit-logs";
import { getDailyPaymentStats, type DailyPaymentStats } from "@/lib/data/payments";
import { generateObject } from "ai";
import { z } from "zod";
import { MODEL } from "./model";

const DailySummaryNarrativeSchema = z.object({
  headline: z.string().describe("One sentence summary of today's activity, max 20 words"),
  highlights: z
    .array(z.string())
    .describe("2 to 4 short bullet points, each covering one notable fact from the stats"),
});

export interface DailySummary {
  stats: DailyPaymentStats & { suspiciousActivity: number };
  headline: string;
  highlights: string[];
}

// The counts are computed deterministically from Supabase first, then handed
// to the model as fact. The model only turns already-correct numbers into a
// short narrative, it never guesses the numbers themselves.
export async function generateDailySummary(): Promise<DailySummary> {
  const [paymentStats, suspiciousActivity] = await Promise.all([
    getDailyPaymentStats(),
    countSuspiciousLoginBursts(),
  ]);

  const stats = { ...paymentStats, suspiciousActivity };

  if (
    stats.paymentsProcessed === 0 &&
    stats.refundsInitiated === 0 &&
    stats.paymentsFailed === 0 &&
    stats.suspiciousActivity === 0
  ) {
    return {
      stats,
      headline: "No activity recorded yet today.",
      highlights: [],
    };
  }

  const { object } = await generateObject({
    model: MODEL,
    schema: DailySummaryNarrativeSchema,
    prompt: `Today's stats so far:
- Payments processed: ${stats.paymentsProcessed}
- Total volume: ${stats.totalVolume.toFixed(2)} USD
- Refunds initiated: ${stats.refundsInitiated}
- Payments failed: ${stats.paymentsFailed}
- Suspicious login bursts detected: ${stats.suspiciousActivity}

Write a headline and highlights summarizing this activity for an admin
dashboard. Do not invent any numbers beyond what is given above.
Never use em dashes or arrow symbols, write plain sentences instead.`,
  });

  return { stats, ...object };
}
