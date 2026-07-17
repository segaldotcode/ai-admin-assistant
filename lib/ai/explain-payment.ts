import { getPaymentById } from "@/lib/data/payments";
import { generateText } from "ai";
import { MODEL } from "./model";

export async function explainPayment(paymentId: string): Promise<string> {
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    return "I could not find a payment with that id.";
  }

  if (payment.status !== "failed" && payment.status !== "refunded") {
    return `This payment is currently ${payment.status}, there is nothing to explain yet.`;
  }

  const reason = payment.failureReason ?? payment.refundReason ?? "no reason was recorded";

  const { text } = await generateText({
    model: MODEL,
    prompt: `Explain in one or two plain sentences, for a non-technical admin,
why this payment is ${payment.status}.

Payment: ${payment.amount} ${payment.currency}, created ${payment.createdAt}.
Recorded reason: ${reason}

Only use the recorded reason above, do not invent additional causes.
Never use em dashes or arrow symbols, write plain sentences instead.`,
  });

  return text.trim();
}
