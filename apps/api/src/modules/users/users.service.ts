import { prisma } from "../../utils/prisma.js";
import { AppError } from "../../utils/errors.js";
import { sanitizeText } from "../../utils/sanitize.js";

export const usersService = {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        volunteerProfile: true,
        emotionalCheckins: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return user;
  },

  async updateMe(
    userId: string,
    input: {
      name?: string;
      displayName?: string | null;
      isAnonymousMode?: boolean;
    }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name ? sanitizeText(input.name) : undefined,
        displayName:
          input.displayName !== undefined
            ? input.displayName
              ? sanitizeText(input.displayName)
              : null
            : undefined,
        isAnonymousMode: input.isAnonymousMode
      }
    });

    return user;
  },

  async deleteMe(userId: string) {
    await prisma.user.delete({
      where: { id: userId }
    });

    return { message: "Conta excluída com sucesso." };
  }
};
