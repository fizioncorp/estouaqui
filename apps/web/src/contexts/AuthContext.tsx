import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import type { AuthUser } from "../types/auth";
import { authService } from "../services/authService";
import { connectSocket, disconnectSocket } from "../services/socket";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    displayName?: string;
    acceptedTerms: true;
    acceptedPrivacy: true;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "estouaqui.token";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null);
      return;
    }

    try {
      const me = await authService.me();
      setUser(me);
    } catch {
      logout();
    }
  }

  async function login(email: string, password: string) {
    const result = await authService.login({ email, password });
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    connectSocket(result.token);
  }

  async function register(payload: {
    name: string;
    email: string;
    password: string;
    displayName?: string;
    acceptedTerms: true;
    acceptedPrivacy: true;
  }) {
    const result = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    connectSocket(result.token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    disconnectSocket();
  }

  useEffect(() => {
    const currentToken = localStorage.getItem(TOKEN_KEY);

    if (!currentToken) {
      setIsLoading(false);
      return;
    }

    setToken(currentToken);
    connectSocket(currentToken);

    refreshUser().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshUser
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
