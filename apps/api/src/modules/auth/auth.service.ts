import { Role } from "@prisma/client";
import { AppError } from "../../utils/errors.js";
import { signToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { prisma } from "../../utils/prisma.js";
import { legalVersion } from "../../constants/legalTexts.js";
import { sanitizeText } from "../../utils/sanitize.js";

export const authService = {
  async register(input: {
    name: string;
    email: string;
    password: string;
    displayName?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() }
    });

    if (existingUser) {
      throw new AppError("Já existe uma conta com este e-mail.", 409);
    }

    const acceptedAt = new Date();

    const user = await prisma.user.create({
      data: {
        name: sanitizeText(input.name),
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        role: Role.USER,
        displayName: input.displayName ? sanitizeText(input.displayName) : null,
        acceptedTermsAt: acceptedAt,
        acceptedPrivacyAt: acceptedAt,
        consentLogs: {
          create: [
            {
              type: "TERMS",
              acceptedAt,
              version: legalVersion
            },
            {
              type: "PRIVACY",
              acceptedAt,
              version: legalVersion
            }
          ]
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        displayName: true
      }
    });

    const token = signToken({
      userId: user.id,
      role: user.role
    });

    return { user, token };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        volunteerProfile: true
      }
    });

    if (!user || !user.isActive) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const validPassword = await comparePassword(input.password, user.passwordHash);

    if (!validPassword) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const token = signToken({
      userId: user.id,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
        isAnonymousMode: user.isAnonymousMode,
        volunteerProfile: user.volunteerProfile
      }
    };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        volunteerProfile: true
      }
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      isAnonymousMode: user.isAnonymousMode,
      acceptedTermsAt: user.acceptedTermsAt,
      acceptedPrivacyAt: user.acceptedPrivacyAt,
      volunteerProfile: user.volunteerProfile
    };
  }
};
