import { getPaymentById } from "@/lib/data/payments";
import type { Locale } from "@/lib/i18n";
import { generateText } from "ai";
import { MODEL } from "./model";
import { languageName } from "./language";

const NOT_FOUND: Record<Locale, string> = {
  en: "I could not find a payment with that id.",
  fr: "Je n'ai pas trouvé de paiement avec cet identifiant.",
};

export async function explainPayment(paymentId: string, locale: Locale = "en"): Promise<string> {
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    return NOT_FOUND[locale];
  }

  if (payment.status !== "failed" && payment.status !== "refunded") {
    return locale === "fr"
      ? `Ce paiement est actuellement "${payment.status}", il n'y a rien à expliquer pour l'instant.`
      : `This payment is currently ${payment.status}, there is nothing to explain yet.`;
  }

  const reason = payment.failureReason ?? payment.refundReason ?? "no reason was recorded";

  const { text } = await generateText({
    model: MODEL,
    prompt: `Explain in one or two plain sentences, for a non-technical admin,
why this payment is ${payment.status}.

Payment: ${payment.amount} ${payment.currency}, created ${payment.createdAt}.
Recorded reason: ${reason}

Only use the recorded reason above, do not invent additional causes.
Never use em dashes or arrow symbols, write plain sentences instead.
Respond in ${languageName(locale)}.`,
  });

  return text.trim();
}
