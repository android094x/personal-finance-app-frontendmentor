import type { PaginationResponse } from "@finance/shared";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const API_BASE = `${BASE_URL}/api`;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: { pagination?: PaginationResponse };
}

const request = async <T>(
  url: string | URL,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers },
  });

  console.log("API response:", res);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
};

export const api = {
  get: async <T>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<ApiResponse<T>> => {
    const url = new URL(`${API_BASE}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return request<T>(url);
  },

  post: async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
    return request<T>(`${API_BASE}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
