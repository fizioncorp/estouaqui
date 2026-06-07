import { Role, VolunteerStatus } from "@prisma/client";
import { legalVersion } from "../../constants/legalTexts.js";
import { AppError } from "../../utils/errors.js";
import { prisma } from "../../utils/prisma.js";
import { sanitizeText } from "../../utils/sanitize.js";

export const volunteersService = {
  async apply(
    userId: string,
    input: { motivation: string; experience?: string; availability?: string }
  ) {
    const acceptedAt = new Date();

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const volunteerProfile = await prisma.volunteerProfile.upsert({
      where: { userId },
      update: {
        motivation: sanitizeText(input.motivation),
        experience: input.experience ? sanitizeText(input.experience) : null,
        availability: input.availability ? sanitizeText(input.availability) : null,
        acceptedVolunteerTermAt: acceptedAt,
        status: VolunteerStatus.PENDING,
        rejectedReason: null,
        blockedReason: null
      },
      create: {
        userId,
        motivation: sanitizeText(input.motivation),
        experience: input.experience ? sanitizeText(input.experience) : null,
        availability: input.availability ? sanitizeText(input.availability) : null,
        acceptedVolunteerTermAt: acceptedAt
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: Role.VOLUNTEER
      }
    });

    await prisma.consentLog.create({
      data: {
        userId,
        type: "VOLUNTEER_TERMS",
        version: legalVersion,
        acceptedAt
      }
    });

    return volunteerProfile;
  },

  async getMe(userId: string) {
    const volunteerProfile = await prisma.volunteerProfile.findUnique({
      where: { userId },
      include: {
        trainingProgress: true
      }
    });

    const trainingModules = await prisma.trainingModule.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    });

    return {
      profile: volunteerProfile,
      trainingModules
    };
  },

  async completeTraining(userId: string) {
    const volunteerProfile = await prisma.volunteerProfile.findUnique({
      where: { userId }
    });

    if (!volunteerProfile) {
      throw new AppError("Você precisa enviar sua candidatura primeiro.", 404);
    }

    const modules = await prisma.trainingModule.findMany({
      where: { isActive: true }
    });

    const now = new Date();

    await prisma.$transaction([
      ...modules.map((module) =>
        prisma.trainingProgress.upsert({
          where: {
            volunteerProfileId_moduleId: {
              volunteerProfileId: volunteerProfile.id,
              moduleId: module.id
            }
          },
          update: {
            completedAt: now
          },
          create: {
            volunteerProfileId: volunteerProfile.id,
            moduleId: module.id,
            completedAt: now
          }
        })
      ),
      prisma.volunteerProfile.update({
        where: { id: volunteerProfile.id },
        data: {
          trainingCompleted: true,
          trainingCompletedAt: now
        }
      })
    ]);

    return prisma.volunteerProfile.findUnique({
      where: { id: volunteerProfile.id }
    });
  },

  async dashboard(userId: string) {
    const profile = await prisma.volunteerProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new AppError("Você ainda não possui perfil de voluntário.", 404);
    }

    const waitingRequests =
      profile.status === VolunteerStatus.APPROVED && profile.trainingCompleted
        ? await prisma.supportRequest.findMany({
            where: {
              status: "WAITING"
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
            orderBy: [{ urgency: "desc" }, { createdAt: "asc" }]
          })
        : [];

    const activeConversation = await prisma.conversation.findFirst({
      where: {
        volunteerId: userId,
        status: "ACTIVE"
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            name: true
          }
        }
      }
    });

    return {
      profile,
      waitingRequests,
      activeConversation,
      quickRules: [
        "Ouça com atenção.",
        "Não dê diagnóstico.",
        "Não peça WhatsApp pessoal.",
        "Acione o admin se perceber risco."
      ]
    };
  }
};
