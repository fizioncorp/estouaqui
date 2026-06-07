import { ConversationStatus, Role } from "@prisma/client";
import { AppError } from "../../utils/errors.js";
import { prisma } from "../../utils/prisma.js";
import { sanitizeText } from "../../utils/sanitize.js";
import { getSocketServer } from "../../sockets/socketServer.js";

export const reportsService = {
  async createReport(
    userId: string,
    role: Role,
    input: { conversationId: string; reason: string; description?: string }
  ) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId }
    });

    if (!conversation) {
      throw new AppError("Conversa não encontrada.", 404);
    }

    const isParticipant =
      conversation.userId === userId || conversation.volunteerId === userId;
    const isAdmin = role === Role.ADMIN;

    if (!isParticipant && !isAdmin) {
      throw new AppError("Você não pode denunciar esta conversa.", 403);
    }

    const report = await prisma.report.create({
      data: {
        conversationId: input.conversationId,
        reportedById: userId,
        reason: input.reason as never,
        description: input.description ? sanitizeText(input.description) : null
      }
    });

    await prisma.conversation.update({
      where: { id: input.conversationId },
      data: {
        status: ConversationStatus.REPORTED
      }
    });

    getSocketServer()?.emit("report_created", {
      reportId: report.id,
      conversationId: input.conversationId
    });

    return report;
  },

  async getAdminReports() {
    return prisma.report.findMany({
      include: {
        conversation: {
          include: {
            user: {
              select: { id: true, name: true, displayName: true }
            },
            volunteer: {
              select: { id: true, name: true, displayName: true }
            }
          }
        },
        reportedBy: {
          select: { id: true, name: true, displayName: true, role: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async updateReportStatus(reportId: string, status: string) {
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status: status as never }
    });

    return report;
  }
};
