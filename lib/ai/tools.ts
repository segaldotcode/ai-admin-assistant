import { searchAuditLogs } from "@/lib/data/audit-logs";
import { searchPayments } from "@/lib/data/payments";
import { tool } from "ai";
import { z } from "zod";

export const queryAuditLogs = tool({
  description:
    "Search the audit_logs table for events like LOGIN_FAILED, LOGIN_SUCCEEDED, PAYMENT_CREATED, PAYMENT_SUCCEEDED, PAYMENT_FAILED, PAYMENT_REFUNDED, FLAG_TOGGLED, USER_UPDATED. Use this for questions about what happened, when, and by whom.",
  inputSchema: z.object({
    action: z.string().optional().describe("Exact action name to filter by, e.g. LOGIN_FAILED"),
    dateFrom: z.string().optional().describe("ISO timestamp, only return events after this"),
    dateTo: z.string().optional().describe("ISO timestamp, only return events before this"),
    limit: z.number().int().min(1).max(100).default(20),
  }),
  execute: async ({ action, dateFrom, dateTo, limit }) => {
    const logs = await searchAuditLogs({ action, dateFrom, dateTo }, limit);
    return { count: logs.length, logs };
  },
});

export const queryPayments = tool({
  description:
    "Search the payments table by status and date range. Use this for questions about payments, refunds, failures, and transaction volume. Each payment includes failureReason or refundReason when applicable.",
  inputSchema: z.object({
    status: z
      .enum(["pending", "processing", "success", "failed", "refunded"])
      .optional()
      .describe("Payment status to filter by"),
    dateFrom: z.string().optional().describe("ISO timestamp, only return payments after this"),
    dateTo: z.string().optional().describe("ISO timestamp, only return payments before this"),
    limit: z.number().int().min(1).max(100).default(20),
  }),
  execute: async ({ status, dateFrom, dateTo, limit }) => {
    const payments = await searchPayments({ status, dateFrom, dateTo }, limit);
    return { count: payments.length, payments };
  },
});

export const stevenTools = { queryAuditLogs, queryPayments };
