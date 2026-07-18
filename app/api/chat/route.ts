import { MODEL } from "@/lib/ai/model";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { stevenTools } from "@/lib/ai/tools";
import type { Locale } from "@/lib/i18n";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, locale }: { messages: UIMessage[]; locale?: Locale } = await req.json();

  const result = streamText({
    model: MODEL,
    system: buildSystemPrompt(locale),
    messages: await convertToModelMessages(messages),
    tools: stevenTools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
