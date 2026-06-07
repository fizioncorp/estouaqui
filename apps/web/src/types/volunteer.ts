import type { SupportRequest } from "./support";
import type { VolunteerProfile } from "./auth";

export type TrainingModule = {
  id: string;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
};

export type VolunteerDashboardData = {
  profile: VolunteerProfile;
  waitingRequests: Array<
    SupportRequest & {
      user: {
        id: string;
        displayName?: string | null;
        isAnonymousMode?: boolean;
      };
    }
  >;
  activeConversation?: {
    id: string;
    user: {
      id: string;
      displayName?: string | null;
      name: string;
    };
  } | null;
  quickRules: string[];
};
