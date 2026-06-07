import type { AuthResponse, AuthUser } from "../types/auth";
import { api } from "./api";

export const authService = {
  async register(payload: {
    name: string;
    email: string;
    password: string;
    displayName?: string;
    acceptedTerms: true;
    acceptedPrivacy: true;
  }) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: { email: string; password: string }) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async me() {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  }
};
