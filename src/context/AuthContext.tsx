import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api, setForceLogout, tokenStore } from "../api";
import type { LoginData, User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    setForceLogout(clearSession);
  }, [clearSession]);

  // Au rafraîchissement de la page : on recharge l'utilisateur avec /me
  useEffect(() => {
    const restore = async () => {
      if (!tokenStore.getAccess() && !tokenStore.getRefresh()) {
        setLoading(false);
        return;
      }
      try {
        const res = await api<User>("/auth/me");
        setUser(res.data);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [clearSession]);

  async function login(email: string, password: string) {
    const res = await api<LoginData>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStore.set(res.data.accessToken, res.data.refreshToken);
    setUser(res.data.user);
  }

  async function logout() {
    try {
      await api<null>("/auth/logout", { method: "POST" });
    } catch {
      // on déconnecte quand même côté navigateur
    }
    clearSession();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}