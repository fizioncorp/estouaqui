import type { Role } from "./auth";

export type MessageType = "TEXT" | "SYSTEM" | "SAFETY";

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    displayName?: string | null;
    role: Role;
  };
};

export type ConversationStatus = "WAITING" | "ACTIVE" | "CLOSED" | "REPORTED" | "ESCALATED";

export type Conversation = {
  id: string;
  supportRequestId: string;
  userId: string;
  volunteerId?: string | null;
  status: ConversationStatus;
  startedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationDetail = Conversation & {
  supportRequest: {
    id: string;
    category: string;
    urgency: string;
    status: string;
    initialMessage?: string | null;
  };
  user: {
    id: string;
    name?: string;
    displayName?: string | null;
  };
  volunteer?: {
    id: string;
    name?: string;
    displayName?: string | null;
  } | null;
  messages: ChatMessage[];
  reports: Array<{
    id: string;
    reason: string;
    status: string;
    description?: string | null;
  }>;
};
