import type { Server as HttpServer } from "node:http";
import { ConversationStatus, MessageType, Role, VolunteerStatus } from "@prisma/client";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { prisma } from "../utils/prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { cleanMessageContent } from "../utils/sanitize.js";

let io: Server | null = null;

const messageBuckets = new Map<string, { count: number; resetAt: number }>();

function canSendMessage(userId: string) {
  const now = Date.now();
  const bucket = messageBuckets.get(userId);

  if (!bucket || bucket.resetAt < now) {
    messageBuckets.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (bucket.count >= 25) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function getSocketServer() {
  return io;
}

export function configureSocketServer(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token || typeof token !== "string") {
        return next(new Error("Token ausente"));
      }

      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { volunteerProfile: true }
      });

      if (!user || !user.isActive) {
        return next(new Error("Usuário inválido"));
      }

      socket.data.user = {
        id: user.id,
        role: user.role,
        volunteerStatus: user.volunteerProfile?.status
      };

      return next();
    } catch {
      return next(new Error("Falha na autenticação"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user as {
      id: string;
      role: Role;
      volunteerStatus?: VolunteerStatus;
    };

    socket.join(`user:${user.id}`);

    if (
      user.role === Role.VOLUNTEER &&
      user.volunteerStatus === VolunteerStatus.APPROVED
    ) {
      socket.join("volunteers:approved");
      io?.emit("volunteer_available", { userId: user.id });
    }

    socket.on("join_conversation", async (conversationId: string) => {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          reports: {
            where: {
              status: {
                in: ["OPEN", "REVIEWING"]
              }
            }
          }
        }
      });

      if (!conversation) {
        socket.emit("error_message", { message: "Conversa não encontrada." });
        return;
      }

      const isParticipant =
        conversation.userId === user.id || conversation.volunteerId === user.id;
      const isAdminAuthorized =
        user.role === Role.ADMIN &&
        (conversation.status === ConversationStatus.ESCALATED ||
          conversation.status === ConversationStatus.REPORTED ||
          conversation.reports.length > 0);

      if (!isParticipant && !isAdminAuthorized) {
        socket.emit("error_message", { message: "Acesso negado à conversa." });
        return;
      }

      socket.join(`conversation:${conversationId}`);
    });

    socket.on(
      "send_message",
      async (payload: { conversationId: string; content: string }) => {
        if (!canSendMessage(user.id)) {
          socket.emit("error_message", {
            message: "Limite de mensagens atingido. Aguarde um pouco."
          });
          return;
        }

        const conversation = await prisma.conversation.findUnique({
          where: { id: payload.conversationId }
        });

        if (!conversation || conversation.status !== ConversationStatus.ACTIVE) {
          socket.emit("error_message", {
            message: "A conversa não está ativa."
          });
          return;
        }

        const isParticipant =
          conversation.userId === user.id || conversation.volunteerId === user.id;

        if (!isParticipant) {
          socket.emit("error_message", {
            message: "Você não participa desta conversa."
          });
          return;
        }

        const cleaned = cleanMessageContent(payload.content);

        if (!cleaned.isAllowed) {
          await prisma.safetyEvent.create({
            data: {
              userId: user.id,
              supportRequestId: conversation.supportRequestId,
              type: "ABUSE_RISK",
              description:
                "Mensagem bloqueada por conter telefone, e-mail ou link externo."
            }
          });

          socket.emit("error_message", { message: cleaned.content });
          return;
        }

        const message = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: user.id,
            content: cleaned.content,
            type: MessageType.TEXT
          },
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
        });

        io?.to(`conversation:${conversation.id}`).emit("receive_message", message);
      }
    );
  });

  return io;
}
