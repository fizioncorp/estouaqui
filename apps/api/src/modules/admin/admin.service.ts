import { ConversationStatus, ReportStatus, SupportStatus, VolunteerStatus } from "@prisma/client";
import { AppError } from "../../utils/errors.js";
import { prisma } from "../../utils/prisma.js";

export const adminService = {
  async dashboard() {
    const [
      totalUsers,
      pendingVolunteers,
      approvedVolunteers,
      waitingRequests,
      activeConversations,
      closedConversations,
      openReports,
      safetyEvents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.volunteerProfile.count({ where: { status: VolunteerStatus.PENDING } }),
      prisma.volunteerProfile.count({ where: { status: VolunteerStatus.APPROVED } }),
      prisma.supportRequest.count({ where: { status: SupportStatus.WAITING } }),
      prisma.conversation.count({ where: { status: ConversationStatus.ACTIVE } }),
      prisma.conversation.count({ where: { status: ConversationStatus.CLOSED } }),
      prisma.report.count({ where: { status: ReportStatus.OPEN } }),
      prisma.safetyEvent.count()
    ]);

    return {
      totalUsers,
      pendingVolunteers,
      approvedVolunteers,
      waitingRequests,
      activeConversations,
      closedConversations,
      openReports,
      safetyEvents
    };
  },

  async listVolunteers() {
    return prisma.volunteerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async approveVolunteer(volunteerProfileId: string) {
    return prisma.volunteerProfile.update({
      where: { id: volunteerProfileId },
      data: {
        status: VolunteerStatus.APPROVED,
        approvedAt: new Date(),
        rejectedReason: null,
        blockedReason: null
      }
    });
  },

  async rejectVolunteer(volunteerProfileId: string, rejectedReason?: string) {
    return prisma.volunteerProfile.update({
      where: { id: volunteerProfileId },
      data: {
        status: VolunteerStatus.REJECTED,
        rejectedReason: rejectedReason || "Perfil recusado pela administração."
      }
    });
  },

  async blockVolunteer(volunteerProfileId: string, blockedReason?: string) {
    return prisma.volunteerProfile.update({
      where: { id: volunteerProfileId },
      data: {
        status: VolunteerStatus.BLOCKED,
        blockedReason: blockedReason || "Conta bloqueada pela administração."
      }
    });
  },

  async reportedConversations() {
    return prisma.conversation.findMany({
      where: {
        OR: [{ status: ConversationStatus.REPORTED }, { status: ConversationStatus.ESCALATED }]
      },
      include: {
        user: {
          select: { id: true, name: true, displayName: true }
        },
        volunteer: {
          select: { id: true, name: true, displayName: true }
        },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                displayName: true,
                role: true
              }
            }
          }
        },
        reports: true
      },
      orderBy: { updatedAt: "desc" }
    });
  },

  async safetyEvents() {
    return prisma.safetyEvent.findMany({
      include: {
        user: {
          select: { id: true, name: true, displayName: true, role: true }
        },
        supportRequest: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async updateReportStatus(reportId: string, status: string) {
    const report = await prisma.report.findUnique({
      where: { id: reportId }
    });

    if (!report) {
      throw new AppError("Denúncia não encontrada.", 404);
    }

    return prisma.report.update({
      where: { id: reportId },
      data: { status: status as never }
    });
  }
};
