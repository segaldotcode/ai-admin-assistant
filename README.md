# AI Admin Assistant

## Why this exists

Most "AI admin assistant" projects are a thin wrapper around a chat API with no real context. This one is not. The goal is an assistant that is genuinely useful: it reads from the real business data of the other modules in this ecosystem (Audit Log, Payment Tracking), not from a generic prompt.

The core idea: ask a plain-language question about what happened in the system, and get an answer grounded in actual data, not a guess.

## Features

- Automatic daily summary of activity (payments processed, refunds initiated, suspicious activity detected)
- Plain-language explanation of a specific event, for example "why did this payment fail?"
- Natural language queries over audit logs and payments, for example "show me this week's suspicious transactions"

## Tech stack

- Next.js (App Router)
- Vercel AI Gateway (Anthropic Claude)
- Supabase (reads `audit_logs` and `payments`)
- Tailwind CSS + Shadcn UI
- pnpm

## Screenshots / Demo GIF

Coming soon.

## How to reuse

Coming soon.

## Architecture

Coming soon.
