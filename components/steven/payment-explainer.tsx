"use client";

import { explainPaymentAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payment } from "@/lib/data/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { useState, useTransition } from "react";

export function PaymentExplainer({
  payments,
  dict,
  locale,
}: {
  payments: Payment[];
  dict: Dictionary;
  locale: Locale;
}) {
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (payments.length === 0) return null;

  function handleExplain(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const text = await explainPaymentAction(id, locale);
      setExplanations((prev) => ({ ...prev, [id]: text }));
      setPendingId(null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">{dict.explain.heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.map((payment) => {
          const loading = isPending && pendingId === payment.id;
          const explanation = explanations[payment.id];

          return (
            <div key={payment.id} className="space-y-2 border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={payment.status === "failed" ? "destructive" : "secondary"}>
                    {payment.status}
                  </Badge>
                  <span>
                    {payment.amount.toFixed(2)} {payment.currency}
                  </span>
                  {payment.userEmail && (
                    <span className="text-muted-foreground">{payment.userEmail}</span>
                  )}
                </div>
                {!explanation && (
                  <Button
                    variant="outline"
                    size="sm"
                    data-cuelume-press
                    data-cuelume-release
                    disabled={loading}
                    onClick={() => handleExplain(payment.id)}
                  >
                    {loading ? dict.explain.loading : dict.explain.button}
                  </Button>
                )}
              </div>
              {loading && <Skeleton className="h-4 w-full" />}
              {explanation && <p className="text-muted-foreground text-sm">{explanation}</p>}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
