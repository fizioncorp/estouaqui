import {
  ConversationStatus,
  MessageType,
  SupportStatus,
  Urgency,
  VolunteerStatus
} from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import { AppError } from "../../utils/errors.js";
import { cleanMessageContent, sanitizeText } from "../../utils/sanitize.js";
import { getSocketServer } from "../../sockets/socketServer.js";

export const supportService = {
  async createTriage(userId: string, input: { isEmergency: boolean; description?: string }) {
    if (input.isEmergency) {
      await prisma.safetyEvent.create({
        data: {
          userId,
          type: "EMERGENCY_TRIAGE",
          description:
            input.description || "Usuário informou risco imediato na triagem inicial."
        }
      });
    }

    return {
      isEmergency: input.isEmergency,
      nextStep: input.isEmergency ? "EMERGENCY_SCREEN" : "EMOTIONAL_CHECKIN"
    };
  },

  async createCheckin(
    userId: string,
    input: {
      mood: number;
      anxiety: number;
      loneliness: number;
      sadness: number;
      stress: number;
      note?: string;
      wantsHumanSupport: boolean;
    }
  ) {
    const checkin = await prisma.emotionalCheckin.create({
      data: {
        userId,
        mood: input.mood,
        anxiety: input.anxiety,
        loneliness: input.loneliness,
        sadness: input.sadness,
        stress: input.stress,
        note: input.note ? sanitizeText(input.note) : undefined,
        wantsHumanSupport: input.wantsHumanSupport
      }
    });

    return checkin;
  },

  async getMyCheckins(userId: string) {
    return prisma.emotionalCheckin.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  async createSupportRequest(
    userId: string,
    input: {
      category: string;
      urgency: Urgency;
      initialMessage?: string;
    }
  ) {
    const activeRequest = await prisma.supportRequest.findFirst({
      where: {
        userId,
        status: { in: [SupportStatus.WAITING, SupportStatus.ACTIVE] }
      },
      include: { conversation: true }
    });

    if (activeRequest) {
      return {
        alreadyExists: true,
        supportRequest: activeRequest,
        conversation: activeRequest.conversation
      };
    }

    if (input.urgency === Urgency.EMERGENCY) {
      await prisma.safetyEvent.create({
        data: {
          userId,
          type: "EMERGENCY_TRIAGE",
          description:
            "Pedido de apoio marcado com urgência de emergência. Chat comum não foi iniciado."
        }
      });

      return {
        redirectToEmergency: true
      };
    }

    const cleanedInitialMessage = input.initialMessage
      ? cleanMessageContent(input.initialMessage)
      : null;

    if (cleanedInitialMessage && !cleanedInitialMessage.isAllowed) {
      throw new AppError(
        "Sua mensagem inicial não pode conter telefone, e-mail ou link externo.",
        422
      );
    }

    const supportRequest = await prisma.supportRequest.create({
      data: {
        userId,
        category: input.category as never,
        urgency: input.urgency,
        status: SupportStatus.WAITING,
        initialMessage: cleanedInitialMessage?.content,
        isEmergency: false
      }
    });

    getSocketServer()?.to("volunteers:approved").emit("support_request_created", {
      supportRequestId: supportRequest.id,
      category: supportRequest.category,
      urgency: supportRequest.urgency
    });

    return { supportRequest };
  },

  async getMyRequests(userId: string) {
    return prisma.supportRequest.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            volunteer: {
              select: { id: true, name: true, displayName: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async getWaitingRequests(userId: string) {
    const volunteer = await prisma.volunteerProfile.findUnique({
      where: { userId }
    });

    if (
      !volunteer ||
      volunteer.status !== VolunteerStatus.APPROVED ||
      !volunteer.trainingCompleted
    ) {
      throw new AppError("Você precisa estar aprovado para ver pedidos.", 403);
    }

    return prisma.supportRequest.findMany({
      where: {
        status: SupportStatus.WAITING
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            isAnonymousMode: true
          }
        }
      },
      orderBy: [
        { urgency: "desc" },
        { createdAt: "asc" }
      ]
    });
  },

  async cancelSupportRequest(userId: string, requestId: string) {
    const supportRequest = await prisma.supportRequest.findFirst({
      where: {
        id: requestId,
        userId
      }
    });

    if (!supportRequest) {
      throw new AppError("Pedido não encontrado.", 404);
    }

    if (supportRequest.status !== SupportStatus.WAITING) {
      throw new AppError("Somente pedidos em espera podem ser cancelados.", 409);
    }

    return prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: SupportStatus.CANCELLED,
        closedAt: new Date()
      }
    });
  },

  async closeSupportRequest(userId: string, requestId: string) {
    const supportRequest = await prisma.supportRequest.findFirst({
      where: {
        id: requestId,
        userId
      },
      include: { conversation: true }
    });

    if (!supportRequest) {
      throw new AppError("Pedido não encontrado.", 404);
    }

    const now = new Date();

    if (supportRequest.conversation) {
      await prisma.message.create({
        data: {
          conversationId: supportRequest.conversation.id,
          senderId: userId,
          type: MessageType.SYSTEM,
          content: "A conversa foi encerrada."
        }
      });

      await prisma.conversation.update({
        where: { id: supportRequest.conversation.id },
        data: {
          status: ConversationStatus.CLOSED,
          closedAt: now
        }
      });

      getSocketServer()
        ?.to(`conversation:${supportRequest.conversation.id}`)
        .emit("conversation_closed", { conversationId: supportRequest.conversation.id });
    }

    return prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: SupportStatus.CLOSED,
        closedAt: now
      }
    });
  }
};
