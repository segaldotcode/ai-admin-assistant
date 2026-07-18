"use server";

import { explainPayment } from "@/lib/ai/explain-payment";
import type { Locale } from "@/lib/i18n";

export async function explainPaymentAction(paymentId: string, locale: Locale): Promise<string> {
  return explainPayment(paymentId, locale);
}
