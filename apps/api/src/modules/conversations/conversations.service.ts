import {
  ConversationStatus,
  MessageType,
  Role,
  SupportStatus,
  VolunteerStatus
} from "@prisma/client";
import { AppError } from "../../utils/errors.js";
import { prisma } from "../../utils/prisma.js";
import { getSocketServer } from "../../sockets/socketServer.js";

async function ensureConversationAccess(userId: string, role: Role, conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      supportRequest: true,
      reports: {
        where: {
          status: { in: ["OPEN", "REVIEWING"] }
        }
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
      }
    }
  });

  if (!conversation) {
    throw new AppError("Conversa não encontrada.", 404);
  }

  const isParticipant =
    conversation.userId === userId || conversation.volunteerId === userId;
  const isAdminAuthorized =
    role === Role.ADMIN &&
    (conversation.status === ConversationStatus.REPORTED ||
      conversation.status === ConversationStatus.ESCALATED ||
      conversation.reports.length > 0);

  if (!isParticipant && !isAdminAuthorized) {
    throw new AppError("Você não pode acessar esta conversa.", 403);
  }

  return conversation;
}

export const conversationsService = {
  async acceptSupportRequest(volunteerId: string, supportRequestId: string) {
    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { userId: volunteerId }
    });

    if (
      !volunteer ||
      volunteer.status !== VolunteerStatus.APPROVED ||
      !volunteer.trainingCompleted
    ) {
      throw new AppError("Você precisa estar aprovado para atender.", 403);
    }

    const activeConversation = await prisma.conversation.findFirst({
      where: {
        volunteerId,
        status: ConversationStatus.ACTIVE
      }
    });

    if (activeConversation) {
      throw new AppError(
        "No MVP, cada voluntário pode atender apenas uma conversa ativa por vez.",
        409
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const supportRequest = await tx.supportRequest.findUnique({
        where: { id: supportRequestId }
      });

      if (!supportRequest || supportRequest.status !== SupportStatus.WAITING) {
        throw new AppError("Este pedido não está mais disponível.", 409);
      }

      await tx.supportRequest.update({
        where: { id: supportRequestId },
        data: { status: SupportStatus.ACTIVE }
      });

      const conversation = await tx.conversation.create({
        data: {
          supportRequestId,
          userId: supportRequest.userId,
          volunteerId,
          status: ConversationStatus.ACTIVE,
          startedAt: new Date()
        }
      });

      await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: volunteerId,
          type: MessageType.SYSTEM,
          content:
            "A conversa foi iniciada. Este espaço oferece apoio humano e não substitui atendimento profissional."
        }
      });

      return conversation;
    });

    getSocketServer()?.to(`user:${result.userId}`).emit("support_request_accepted", {
      conversationId: result.id,
      supportRequestId
    });

    return result;
  },

  async getMyConversations(userId: string, role: Role) {
    if (role === Role.USER) {
      return prisma.conversation.findMany({
        where: { userId },
        include: {
          volunteer: {
            select: {
              id: true,
              name: true,
              displayName: true
            }
          },
          supportRequest: true
        },
        orderBy: { updatedAt: "desc" }
      });
    }

    if (role === Role.VOLUNTEER) {
      return prisma.conversation.findMany({
        where: { volunteerId: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayName: true
            }
          },
          supportRequest: true
        },
        orderBy: { updatedAt: "desc" }
      });
    }

    return prisma.conversation.findMany({
      where: {
        OR: [{ status: ConversationStatus.REPORTED }, { status: ConversationStatus.ESCALATED }]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        },
        reports: true
      },
      orderBy: { updatedAt: "desc" }
    });
  },

  async getConversation(userId: string, role: Role, conversationId: string) {
    return ensureConversationAccess(userId, role, conversationId);
  },

  async closeConversation(userId: string, role: Role, conversationId: string) {
    const conversation = await ensureConversationAccess(userId, role, conversationId);

    const now = new Date();

    await prisma.$transaction([
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: ConversationStatus.CLOSED,
          closedAt: now
        }
      }),
      prisma.supportRequest.update({
        where: { id: conversation.supportRequestId },
        data: {
          status: SupportStatus.CLOSED,
          closedAt: now
        }
      }),
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          type: MessageType.SYSTEM,
          content: "A conversa foi encerrada."
        }
      })
    ]);

    getSocketServer()
      ?.to(`conversation:${conversationId}`)
      .emit("conversation_closed", { conversationId });

    return { message: "Conversa encerrada com sucesso." };
  },

  async escalateConversation(userId: string, role: Role, conversationId: string) {
    const conversation = await ensureConversationAccess(userId, role, conversationId);

    await prisma.$transaction([
      prisma.conversation.update({
        where: { id: conversationId },
        data: { status: ConversationStatus.ESCALATED }
      }),
      prisma.supportRequest.update({
        where: { id: conversation.supportRequestId },
        data: { status: SupportStatus.ESCALATED }
      }),
      prisma.safetyEvent.create({
        data: {
          userId,
          supportRequestId: conversation.supportRequestId,
          type: "ADMIN_ESCALATION",
          description: `Conversa escalada por ${role}.`
        }
      })
    ]);

    return { message: "Conversa escalada para análise administrativa." };
  }
};
