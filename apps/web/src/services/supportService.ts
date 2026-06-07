import type { ConversationDetail } from "../types/chat";
import type { EmotionalCheckin, SupportRequest } from "../types/support";
import { api } from "./api";

export const supportService = {
  async triage(payload: { isEmergency: boolean; description?: string }) {
    const { data } = await api.post("/support/triage", payload);
    return data;
  },

  async createCheckin(payload: Omit<EmotionalCheckin, "id" | "createdAt">) {
    const { data } = await api.post<EmotionalCheckin>("/support/checkins", payload);
    return data;
  },

  async getMyCheckins() {
    const { data } = await api.get<EmotionalCheckin[]>("/support/checkins/me");
    return data;
  },

  async createSupportRequest(payload: {
    category: string;
    urgency: string;
    initialMessage?: string;
  }) {
    const { data } = await api.post("/support/requests", payload);
    return data;
  },

  async getMySupportRequests() {
    const { data } = await api.get<SupportRequest[]>("/support/requests/me");
    return data;
  },

  async getWaitingRequests() {
    const { data } = await api.get("/support/requests/waiting");
    return data;
  },

  async getMyConversations() {
    const { data } = await api.get<ConversationDetail[]>("/conversations/me");
    return data;
  }
};
