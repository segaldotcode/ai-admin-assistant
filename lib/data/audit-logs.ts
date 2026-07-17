import { createClient } from "@/lib/supabase/server";
import type { AuditLogEntry } from "./types";

export interface AuditLogFilters {
  action?: string;
  userEmail?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
  users: { email: string } | null;
}

function mapRow(row: AuditLogRow): AuditLogEntry {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.users?.email ?? null,
    action: row.action,
    metadata: row.metadata,
    createdAt: row.created_at,
  };
}

export async function searchAuditLogs(
  filters: AuditLogFilters = {},
  limit = 50,
): Promise<AuditLogEntry[]> {
  const supabase = await createClient();

  let query = supabase
    .from("audit_logs")
    .select("id, user_id, action, metadata, created_at, users(email)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.action) query = query.eq("action", filters.action);
  if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
  if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
  if (filters.userEmail) query = query.eq("users.email", filters.userEmail);

  const { data, error } = await query.returns<AuditLogRow[]>();

  if (error || !data) {
    console.error("Failed to load audit logs:", error);
    return [];
  }

  return data.map(mapRow);
}

// A lightweight replica of the audit-log-system's suspicious activity check:
// counts distinct users with 5+ LOGIN_FAILED events within any 10 minute
// window in the last 24 hours. Good enough for Steven's daily summary count,
// not meant to replace the full detector in audit-log-system.
export async function countSuspiciousLoginBursts(): Promise<number> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const logs = await searchAuditLogs({ action: "LOGIN_FAILED", dateFrom: since }, 500);

  const byUser = new Map<string, number[]>();
  for (const log of logs) {
    const key = log.userId ?? "unknown";
    const timestamps = byUser.get(key) ?? [];
    timestamps.push(new Date(log.createdAt).getTime());
    byUser.set(key, timestamps);
  }

  let suspiciousUsers = 0;
  const windowMs = 10 * 60 * 1000;

  for (const timestamps of byUser.values()) {
    timestamps.sort((a, b) => a - b);
    for (let i = 0; i + 4 < timestamps.length; i++) {
      if (timestamps[i + 4] - timestamps[i] <= windowMs) {
        suspiciousUsers++;
        break;
      }
    }
  }

  return suspiciousUsers;
}
