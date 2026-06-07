import type { VolunteerDashboardData, TrainingModule } from "../types/volunteer";
import { api } from "./api";

export const volunteerService = {
  async apply(payload: {
    motivation: string;
    experience?: string;
    availability?: string;
    acceptedVolunteerTerms: true;
  }) {
    const { data } = await api.post("/volunteers/apply", payload);
    return data;
  },

  async me() {
    const { data } = await api.get<{
      profile: VolunteerDashboardData["profile"];
      trainingModules: TrainingModule[];
    }>("/volunteers/me");
    return data;
  },

  async completeTraining() {
    const { data } = await api.post("/volunteers/training/complete");
    return data;
  },

  async dashboard() {
    const { data } = await api.get<VolunteerDashboardData>("/volunteers/dashboard");
    return data;
  },

  async acceptRequest(supportRequestId: string) {
    const { data } = await api.post(`/conversations/${supportRequestId}/accept`);
    return data;
  }
};
