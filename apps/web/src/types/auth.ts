export type Role = "USER" | "VOLUNTEER" | "ADMIN";

export type VolunteerStatus = "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";

export type VolunteerProfile = {
  id: string;
  userId: string;
  status: VolunteerStatus;
  motivation: string;
  experience?: string | null;
  availability?: string | null;
  trainingCompleted: boolean;
  trainingCompletedAt?: string | null;
  approvedAt?: string | null;
  rejectedReason?: string | null;
  blockedReason?: string | null;
  acceptedVolunteerTermAt?: string | null;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  displayName?: string | null;
  isAnonymousMode?: boolean;
  acceptedTermsAt?: string | null;
  acceptedPrivacyAt?: string | null;
  volunteerProfile?: VolunteerProfile | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
