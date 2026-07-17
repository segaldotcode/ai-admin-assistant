"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Suggestion,
  Suggestions,
} from "@/components/ai-elements/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ASSISTANT_NAME } from "@/lib/ai/model";
import { useChat } from "@ai-sdk/react";
import { SparklesIcon } from "lucide-react";

const STARTER_QUESTIONS = [
  "Summarize today's activity",
  "Show me this week's failed payments",
  "Any suspicious login activity recently?",
];

export function StevenChat() {
  const { messages, sendMessage, status } = useChat();

  return (
    <div className="flex h-[32rem] flex-col rounded-lg border">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<SparklesIcon className="size-6" />}
              title={`Ask ${ASSISTANT_NAME} anything`}
              description="Payments, audit events, suspicious activity: it's all backed by real data."
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${message.id}-${i}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      case "tool-queryAuditLogs":
                      case "tool-queryPayments":
                        return (
                          <Tool key={part.toolCallId ?? `${message.id}-${i}`} defaultOpen={false}>
                            <ToolHeader state={part.state} type={part.type} />
                            <ToolContent>
                              <ToolInput input={part.input} />
                              <ToolOutput
                                errorText={part.errorText}
                                output={
                                  part.state === "output-available"
                                    ? JSON.stringify(part.output, null, 2)
                                    : undefined
                                }
                              />
                            </ToolContent>
                          </Tool>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
      </Conversation>

      <div className="space-y-3 border-t p-3">
        {messages.length === 0 && (
          <Suggestions>
            {STARTER_QUESTIONS.map((question) => (
              <Suggestion
                key={question}
                onClick={() => sendMessage({ text: question })}
                suggestion={question}
              />
            ))}
          </Suggestions>
        )}
        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            if (message.text.trim()) {
              sendMessage({ text: message.text });
              event.currentTarget.reset();
            }
          }}
          className="flex items-end gap-2"
        >
          <PromptInputTextarea
            className="flex-1"
            disabled={status === "streaming" || status === "submitted"}
            placeholder={`Message ${ASSISTANT_NAME}...`}
            rows={1}
          />
          <PromptInputSubmit status={status} />
        </PromptInput>
      </div>
    </div>
  );
}
