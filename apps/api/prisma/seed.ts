import bcrypt from "bcrypt";
import { PrismaClient, Role, VolunteerStatus } from "@prisma/client";

const prisma = new PrismaClient();

const trainingModules = [
  {
    order: 1,
    title: "O que é acolhimento",
    content:
      "Acolher é ouvir com atenção, respeitar o ritmo da pessoa e oferecer presença humana sem julgamento."
  },
  {
    order: 2,
    title: "O papel do voluntário",
    content:
      "O voluntário não faz terapia, não diagnostica e não promete cura. Seu papel é escutar e orientar com segurança."
  },
  {
    order: 3,
    title: "Como ouvir sem julgar",
    content:
      "Use perguntas abertas, valide emoções e evite minimizar a dor ou disputar narrativas."
  },
  {
    order: 4,
    title: "O que nunca dizer",
    content:
      "Nunca ofereça diagnósticos, não pressione, não imponha religião, não peça dados pessoais e não leve a conversa para fora da plataforma."
  },
  {
    order: 5,
    title: "Como lidar com ansiedade e tristeza",
    content:
      "Mantenha um tom calmo, ajude a pessoa a respirar e pensem juntos em um próximo passo simples e seguro."
  },
  {
    order: 6,
    title: "Situações de risco",
    content:
      "Ao identificar risco de autoagressão, violência ou abuso, o voluntário deve escalar para a administração e incentivar ajuda profissional imediata."
  },
  {
    order: 7,
    title: "Privacidade",
    content:
      "Compartilhe o mínimo necessário, preserve sigilo e trate qualquer dado recebido com cautela."
  },
  {
    order: 8,
    title: "Limites do voluntário",
    content:
      "Você pode escutar, acolher e ajudar a organizar o momento, mas não pode assumir responsabilidades clínicas ou legais."
  },
  {
    order: 9,
    title: "Quando acionar administrador",
    content:
      "Acione o admin ao notar risco, abuso, pedido de dados pessoais, discurso violento ou qualquer situação insegura."
  },
  {
    order: 10,
    title: "Encerramento saudável de conversa",
    content:
      "Resuma o que foi trabalhado, valide a pessoa e incentive um passo concreto e seguro para o momento seguinte."
  }
];

async function upsertUser(params: {
  name: string;
  email: string;
  password: string;
  role: Role;
  displayName?: string;
  acceptedTermsAt?: Date;
  acceptedPrivacyAt?: Date;
}) {
  const passwordHash = await bcrypt.hash(params.password, 10);

  return prisma.user.upsert({
    where: { email: params.email },
    update: {
      name: params.name,
      displayName: params.displayName,
      role: params.role,
      passwordHash,
      acceptedTermsAt: params.acceptedTermsAt,
      acceptedPrivacyAt: params.acceptedPrivacyAt,
      isActive: true
    },
    create: {
      name: params.name,
      displayName: params.displayName,
      role: params.role,
      email: params.email,
      passwordHash,
      acceptedTermsAt: params.acceptedTermsAt,
      acceptedPrivacyAt: params.acceptedPrivacyAt
    }
  });
}

async function main() {
  const now = new Date();

  await prisma.trainingProgress.deleteMany();
  await prisma.trainingModule.deleteMany();

  for (const module of trainingModules) {
    await prisma.trainingModule.create({ data: module });
  }

  const admin = await upsertUser({
    name: "Administrador",
    email: "admin@estouaqui.local",
    password: "Admin123456",
    role: Role.ADMIN,
    displayName: "Equipe Estou Aqui",
    acceptedTermsAt: now,
    acceptedPrivacyAt: now
  });

  const volunteer = await upsertUser({
    name: "Voluntario Aprovado",
    email: "voluntario@estouaqui.local",
    password: "Voluntario123456",
    role: Role.VOLUNTEER,
    displayName: "Voluntario Calmo",
    acceptedTermsAt: now,
    acceptedPrivacyAt: now
  });

  const user = await upsertUser({
    name: "Usuario Comum",
    email: "usuario@estouaqui.local",
    password: "Usuario123456",
    role: Role.USER,
    displayName: "Preciso Conversar",
    acceptedTermsAt: now,
    acceptedPrivacyAt: now
  });

  const volunteerProfile = await prisma.volunteerProfile.upsert({
    where: { userId: volunteer.id },
    update: {
      status: VolunteerStatus.APPROVED,
      motivation: "Quero oferecer escuta gratuita e respeitosa.",
      experience: "Atuação prévia em projeto comunitário.",
      availability: "Noites e fins de semana",
      trainingCompleted: true,
      trainingCompletedAt: now,
      approvedAt: now,
      acceptedVolunteerTermAt: now
    },
    create: {
      userId: volunteer.id,
      status: VolunteerStatus.APPROVED,
      motivation: "Quero oferecer escuta gratuita e respeitosa.",
      experience: "Atuação prévia em projeto comunitário.",
      availability: "Noites e fins de semana",
      trainingCompleted: true,
      trainingCompletedAt: now,
      approvedAt: now,
      acceptedVolunteerTermAt: now
    }
  });

  const modules = await prisma.trainingModule.findMany();

  for (const module of modules) {
    await prisma.trainingProgress.upsert({
      where: {
        volunteerProfileId_moduleId: {
          volunteerProfileId: volunteerProfile.id,
          moduleId: module.id
        }
      },
      update: { completedAt: now },
      create: {
        volunteerProfileId: volunteerProfile.id,
        moduleId: module.id,
        completedAt: now
      }
    });
  }

  await prisma.consentLog.createMany({
    data: [
      { userId: admin.id, type: "TERMS", version: "2026-06-04", acceptedAt: now },
      { userId: admin.id, type: "PRIVACY", version: "2026-06-04", acceptedAt: now },
      { userId: volunteer.id, type: "TERMS", version: "2026-06-04", acceptedAt: now },
      { userId: volunteer.id, type: "PRIVACY", version: "2026-06-04", acceptedAt: now },
      { userId: volunteer.id, type: "VOLUNTEER_TERMS", version: "2026-06-04", acceptedAt: now },
      { userId: user.id, type: "TERMS", version: "2026-06-04", acceptedAt: now },
      { userId: user.id, type: "PRIVACY", version: "2026-06-04", acceptedAt: now }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
