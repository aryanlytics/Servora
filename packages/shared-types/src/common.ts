// ─── API Response Types ──────────────────────────────────

export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// ─── Socket Event Types ─────────────────────────────────

export interface ISocketAuth {
  token: string;
}

export interface ISocketUser {
  userId: string;
  role: string;
}

// ─── Service Event Types ────────────────────────────────

export interface IServiceEvent<T = unknown> {
  event: string;
  data: T;
  timestamp: Date;
}
