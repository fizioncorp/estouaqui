import { api } from "./api";

export const adminService = {
  async dashboard() {
    const { data } = await api.get("/admin/dashboard");
    return data;
  },

  async volunteers() {
    const { data } = await api.get("/admin/volunteers");
    return data;
  },

  async approveVolunteer(id: string) {
    const { data } = await api.patch(`/admin/volunteers/${id}/approve`);
    return data;
  },

  async rejectVolunteer(id: string, reason?: string) {
    const { data } = await api.patch(`/admin/volunteers/${id}/reject`, { reason });
    return data;
  },

  async blockVolunteer(id: string, reason?: string) {
    const { data } = await api.patch(`/admin/volunteers/${id}/block`, { reason });
    return data;
  },

  async reportedConversations() {
    const { data } = await api.get("/admin/conversations/reported");
    return data;
  },

  async safetyEvents() {
    const { data } = await api.get("/admin/safety-events");
    return data;
  },

  async updateReportStatus(id: string, status: string) {
    const { data } = await api.patch(`/admin/reports/${id}/status`, { status });
    return data;
  }
};
