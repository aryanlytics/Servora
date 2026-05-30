import type { IApiResponse } from "@servora/shared-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

/**
 * Typed API client for communicating with the API gateway.
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<IApiResponse<T>> {
  const { method = "GET", body, headers = {}, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data: IApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
}

export const api = {
  // Auth
  register: (body: unknown) =>
    request("/auth/register", { method: "POST", body }),
  login: (body: unknown) =>
    request("/auth/login", { method: "POST", body }),
  refreshToken: (refreshToken: string) =>
    request("/auth/refresh", { method: "POST", body: { refreshToken } }),
  logout: (token: string) =>
    request("/auth/logout", { method: "POST", token }),

  // Users
  getProfile: (token: string) =>
    request("/users/profile", { token }),
  updateProfile: (token: string, body: unknown) =>
    request("/users/profile", { method: "PUT", body, token }),
  searchWorkers: (token: string, params: string) =>
    request(`/users/workers?${params}`, { token }),
  getWorker: (token: string, id: string) =>
    request(`/users/workers/${id}`, { token }),

  // Bookings
  createBooking: (token: string, body: unknown) =>
    request("/bookings", { method: "POST", body, token }),
  getBookings: (token: string, params?: string) =>
    request(`/bookings${params ? `?${params}` : ""}`, { token }),
  getBooking: (token: string, id: string) =>
    request(`/bookings/${id}`, { token }),
  acceptBooking: (token: string, id: string) =>
    request(`/bookings/${id}/accept`, { method: "PATCH", token }),
  startBooking: (token: string, id: string) =>
    request(`/bookings/${id}/start`, { method: "PATCH", token }),
  completeBooking: (token: string, id: string) =>
    request(`/bookings/${id}/complete`, { method: "PATCH", token }),
  cancelBooking: (token: string, id: string, reason?: string) =>
    request(`/bookings/${id}/cancel`, { method: "PATCH", body: { reason }, token }),
  submitReview: (token: string, id: string, body: unknown) =>
    request(`/bookings/${id}/review`, { method: "POST", body, token }),

  // Chat
  getConversations: (token: string) =>
    request("/chat/conversations", { token }),
  getMessages: (token: string, conversationId: string, params?: string) =>
    request(`/chat/conversations/${conversationId}/messages${params ? `?${params}` : ""}`, { token }),
  sendMessage: (token: string, conversationId: string, body: unknown) =>
    request(`/chat/conversations/${conversationId}/messages`, { method: "POST", body, token }),

  // Notifications
  getNotifications: (token: string, params?: string) =>
    request(`/notifications${params ? `?${params}` : ""}`, { token }),
  getUnreadCount: (token: string) =>
    request("/notifications/unread-count", { token }),
  markAsRead: (token: string, id: string) =>
    request(`/notifications/${id}/read`, { method: "PATCH", token }),
  markAllAsRead: (token: string) =>
    request("/notifications/read-all", { method: "PATCH", token }),
};
