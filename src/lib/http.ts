import { tokenStore } from "./token-store";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/** Cek error API berdasarkan satu atau beberapa kode status. */
export function isApiError(error: unknown, ...statuses: number[]): boolean {
  return error instanceof ApiError && statuses.includes(error.status);
}

type Query = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  /** internal: penanda sudah retry sekali setelah refresh */
  retried?: boolean;
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function readPayload(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return fallback;
}

let refreshPromise: Promise<boolean> | null = null;

/** Single-flight: banyak request 401 berbagi satu panggilan refresh. */
export function refreshAccessToken(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return false;

      const payload = await readPayload(res);
      const token =
        payload && typeof payload === "object" && "data" in payload
          ? (payload as { data?: { accessToken?: string } }).data?.accessToken
          : (payload as { accessToken?: string } | null)?.accessToken;

      if (!token) return false;

      tokenStore.set(token);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { ...options.headers };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (!options.skipAuth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (res.status === 401 && !options.skipAuth && !options.retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retried: true });
    }
  }

  const payload = await readPayload(res);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      extractMessage(payload, res.statusText || "Permintaan gagal"),
      payload,
    );
  }

  // Backend membungkus sukses sebagai { success, data }; object ber-message
  // (passthrough) dikembalikan apa adanya.
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

export const api = {
  get: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiRequest<T>(path, { ...options, method: "POST", body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
