import { prisma } from "../../utils/prisma.js";

export const messagesService = {
  async listByConversation(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
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
    });
  }
};
