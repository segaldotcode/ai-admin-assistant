"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ChatStatus } from "ai";
import { CornerDownLeftIcon, Loader2Icon, SquareIcon, XIcon } from "lucide-react";
import type { ComponentProps, FormEvent, KeyboardEventHandler } from "react";

// A trimmed down PromptInput: this app only needs a plain text box and a
// submit button, not the full ai-elements kitchen sink (attachments,
// screenshots, model select, command palette). Those pull in @base-ui/react
// primitives that don't type-check against this project's base-nova style.

export interface PromptInputMessage {
  text: string;
}

export type PromptInputProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void;
};

export const PromptInput = ({ onSubmit, className, children, ...props }: PromptInputProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const text = String(formData.get("text") ?? "").trim();
    onSubmit({ text }, event);
  };

  return (
    <form className={cn(className)} onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
};

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export const PromptInputTextarea = ({
  className,
  onKeyDown,
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
    onKeyDown?.(event);
  };

  return (
    <Textarea
      className={cn("resize-none", className)}
      name="text"
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
};

export const PromptInputSubmit = ({
  className,
  status,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let icon = <CornerDownLeftIcon className="size-4" />;

  if (status === "submitted") {
    icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === "streaming") {
    icon = <SquareIcon className="size-4" />;
  } else if (status === "error") {
    icon = <XIcon className="size-4" />;
  }

  return (
    <Button
      aria-label="Send message"
      className={cn(className)}
      size="icon"
      type="submit"
      {...props}
    >
      {children ?? icon}
    </Button>
  );
};
