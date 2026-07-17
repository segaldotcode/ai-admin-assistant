export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type PaymentStatus = "pending" | "processing" | "success" | "failed" | "refunded";

export interface Payment {
  id: string;
  userId: string | null;
  userEmail: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failureReason: string | null;
  refundReason: string | null;
  createdAt: string;
  updatedAt: string;
}
