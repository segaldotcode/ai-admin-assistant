import { createClient } from "@/lib/supabase/server";
import type { Payment, PaymentStatus } from "./types";

export interface PaymentFilters {
  status?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
}

interface PaymentRow {
  id: string;
  user_id: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  failure_reason: string | null;
  refund_reason: string | null;
  created_at: string;
  updated_at: string;
  users: { email: string } | null;
}

function mapRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.users?.email ?? null,
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    failureReason: row.failure_reason,
    refundReason: row.refund_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_COLUMNS =
  "id, user_id, amount, currency, status, failure_reason, refund_reason, created_at, updated_at, users(email)";

export async function searchPayments(filters: PaymentFilters = {}, limit = 50): Promise<Payment[]> {
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);

  const { data, error } = await query.returns<PaymentRow[]>();

  if (error || !data) {
    console.error("Failed to load payments:", error);
    return [];
  }

  return data.map(mapRow);
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle()
    .returns<PaymentRow | null>();

  if (error || !data) return null;

  return mapRow(data);
}

export interface DailyPaymentStats {
  paymentsProcessed: number;
  refundsInitiated: number;
  paymentsFailed: number;
  totalVolume: number;
}

export async function getDailyPaymentStats(): Promise<DailyPaymentStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaysPayments = await searchPayments({ dateFrom: startOfDay.toISOString() }, 500);

  const successful = todaysPayments.filter((p) => p.status === "success");

  return {
    paymentsProcessed: successful.length,
    refundsInitiated: todaysPayments.filter((p) => p.status === "refunded").length,
    paymentsFailed: todaysPayments.filter((p) => p.status === "failed").length,
    totalVolume: successful.reduce((sum, p) => sum + p.amount, 0),
  };
}
