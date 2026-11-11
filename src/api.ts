import type { ApiResponse, FieldError } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(message: string, status: number, errors: FieldError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const tokenStore = {
  getAccess: () => localStorage.getItem("accessToken"),
  getRefresh: () => localStorage.getItem("refreshToken"),
  set: (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// AuthContext enregistre ici sa fonction de déconnexion
let onForceLogout: () => void = () => {};
export function setForceLogout(fn: () => void) {
  onForceLogout = fn;
}

function send(chemin: string, options: RequestInit): Promise<Response> {
  const token = tokenStore.getAccess();
  return fetch(`${API_URL}${chemin}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>;
    tokenStore.set(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function api<T>(chemin: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  let res = await send(chemin, options);

  // 401 sur une route protégée : renouvellement, sinon déconnexion
  const isAuthRoute = chemin === "/auth/login" || chemin === "/auth/register";
  if (res.status === 401 && !isAuthRoute) {
    refreshing ??= refreshTokens().finally(() => {
      refreshing = null;
    });
    const renewed = await refreshing;
    if (renewed) res = await send(chemin, options);
    if (!renewed || res.status === 401) onForceLogout();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      data?.message ?? `Erreur ${res.status}`,
      res.status,
      data?.errors ?? [],
    );
  }
  return data as ApiResponse<T>;
}