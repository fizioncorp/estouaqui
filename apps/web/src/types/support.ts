export type SupportCategory =
  | "ANXIETY"
  | "SADNESS"
  | "LONELINESS"
  | "ANGER"
  | "GRIEF"
  | "OVERWHELMED"
  | "JUST_TALK"
  | "OTHER";

export type Urgency = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export type SupportStatus = "WAITING" | "ACTIVE" | "CLOSED" | "CANCELLED" | "ESCALATED";

export type EmotionalCheckin = {
  id: string;
  mood: number;
  anxiety: number;
  loneliness: number;
  sadness: number;
  stress: number;
  note?: string | null;
  wantsHumanSupport: boolean;
  createdAt: string;
};

export type SupportRequest = {
  id: string;
  userId: string;
  category: SupportCategory;
  urgency: Urgency;
  status: SupportStatus;
  initialMessage?: string | null;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  conversation?: {
    id: string;
    status: string;
    volunteer?: {
      id: string;
      name: string;
      displayName?: string | null;
    } | null;
  } | null;
};
