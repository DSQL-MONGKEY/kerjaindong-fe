import { api } from "@/lib/http";
import { tokenStore } from "@/lib/token-store";
import type { AuthResponse, AuthUser, Role } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  role?: "JOB_SEEKER" | "EMPLOYER";
}

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

/** Halaman awal sesuai role; dipakai saat redirect setelah login/guard. */
export function homePathForRoles(roles: Role[]): string {
  if (roles.includes("SYS_ADMIN")) return "/admin";
  if (roles.includes("EMPLOYER")) return "/employer";
  if (roles.includes("JOB_SEEKER")) return "/dashboard";
  return "/";
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  // Boot sesi: http.ts otomatis mencoba refresh sekali pada 401, sehingga
  // reload halaman tetap login lewat cookie httpOnly.
  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => api.get<AuthUser>("/users/me"),
    retry: false,
    staleTime: 60_000,
  });

  const user = meQuery.data ?? null;
  const status: AuthStatus = meQuery.isPending
    ? "loading"
    : user
      ? "authenticated"
      : "anonymous";

  const login = useCallback(
    async (identifier: string, password: string) => {
      const res = await api.post<AuthResponse>(
        "/auth/login",
        { identifier, password },
        { skipAuth: true },
      );
      tokenStore.set(res.accessToken);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, res.user);
      return res.user;
    },
    [queryClient],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await api.post<AuthResponse>("/auth/register", payload, {
        skipAuth: true,
      });
      tokenStore.set(res.accessToken);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, res.user);
      return res.user;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Sesi mungkin sudah tidak valid — tetap bersihkan state lokal.
    } finally {
      tokenStore.set(null);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    }
  }, [queryClient]);

  const refreshMe = useCallback(async () => {
    await meQuery.refetch();
  }, [meQuery]);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, status, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
