import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailySummary } from "@/lib/ai/daily-summary";

export function DailySummaryCard({ summary }: { summary: DailySummary }) {
  const { stats, headline, highlights } = summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{stats.paymentsProcessed} payments processed</Badge>
          <Badge variant="secondary">{stats.refundsInitiated} refunds initiated</Badge>
          <Badge variant={stats.paymentsFailed > 0 ? "destructive" : "secondary"}>
            {stats.paymentsFailed} payments failed
          </Badge>
          <Badge variant={stats.suspiciousActivity > 0 ? "destructive" : "secondary"}>
            {stats.suspiciousActivity} suspicious activity
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
