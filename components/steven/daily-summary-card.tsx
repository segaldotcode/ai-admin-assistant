import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailySummary } from "@/lib/ai/daily-summary";
import type { Dictionary } from "@/lib/i18n";

export function DailySummaryCard({ summary, dict }: { summary: DailySummary; dict: Dictionary }) {
  const { stats, headline, highlights } = summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">{dict.summary.heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {stats.paymentsProcessed} {dict.summary.paymentsProcessed}
          </Badge>
          <Badge variant="secondary">
            {stats.refundsInitiated} {dict.summary.refundsInitiated}
          </Badge>
          <Badge variant={stats.paymentsFailed > 0 ? "destructive" : "secondary"}>
            {stats.paymentsFailed} {dict.summary.paymentsFailed}
          </Badge>
          <Badge variant={stats.suspiciousActivity > 0 ? "destructive" : "secondary"}>
            {stats.suspiciousActivity} {dict.summary.suspiciousActivity}
          </Badge>
        </div>

        <p className="font-medium">{headline}</p>

        {highlights.length > 0 && (
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
