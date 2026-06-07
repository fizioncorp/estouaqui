-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'VOLUNTEER', 'ADMIN');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('ANXIETY', 'SADNESS', 'LONELINESS', 'ANGER', 'GRIEF', 'OVERWHELMED', 'JUST_TALK', 'OTHER');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('WAITING', 'ACTIVE', 'CLOSED', 'CANCELLED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('WAITING', 'ACTIVE', 'CLOSED', 'REPORTED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'SYSTEM', 'SAFETY');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('ABUSE', 'HARASSMENT', 'UNSAFE_ADVICE', 'SPAM', 'PERSONAL_DATA_REQUEST', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "SafetyEventType" AS ENUM ('EMERGENCY_TRIAGE', 'SELF_HARM_RISK', 'VIOLENCE_RISK', 'ABUSE_RISK', 'ADMIN_ESCALATION');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('TERMS', 'PRIVACY', 'VOLUNTEER_TERMS', 'SAFETY_NOTICE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "displayName" TEXT,
    "isAnonymousMode" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "acceptedTermsAt" TIMESTAMP(3),
    "acceptedPrivacyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'PENDING',
    "motivation" TEXT NOT NULL,
    "experience" TEXT,
    "availability" TEXT,
    "trainingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingCompletedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "blockedReason" TEXT,
    "acceptedVolunteerTermAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionalCheckin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "anxiety" INTEGER NOT NULL,
    "loneliness" INTEGER NOT NULL,
    "sadness" INTEGER NOT NULL,
    "stress" INTEGER NOT NULL,
    "note" TEXT,
    "wantsHumanSupport" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionalCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "SupportCategory" NOT NULL,
    "urgency" "Urgency" NOT NULL,
    "status" "SupportStatus" NOT NULL DEFAULT 'WAITING',
    "initialMessage" TEXT,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "supportRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "volunteerId" TEXT,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "supportRequestId" TEXT,
    "type" "SafetyEventType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ConsentType" NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProgress" (
    "id" TEXT NOT NULL,
    "volunteerProfileId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerProfile_userId_key" ON "VolunteerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_supportRequestId_key" ON "Conversation"("supportRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProgress_volunteerProfileId_moduleId_key" ON "TrainingProgress"("volunteerProfileId", "moduleId");

-- AddForeignKey
ALTER TABLE "VolunteerProfile" ADD CONSTRAINT "VolunteerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmotionalCheckin" ADD CONSTRAINT "EmotionalCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportRequest" ADD CONSTRAINT "SupportRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_supportRequestId_fkey" FOREIGN KEY ("supportRequestId") REFERENCES "SupportRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyEvent" ADD CONSTRAINT "SafetyEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyEvent" ADD CONSTRAINT "SafetyEvent_supportRequestId_fkey" FOREIGN KEY ("supportRequestId") REFERENCES "SupportRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentLog" ADD CONSTRAINT "ConsentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgress" ADD CONSTRAINT "TrainingProgress_volunteerProfileId_fkey" FOREIGN KEY ("volunteerProfileId") REFERENCES "VolunteerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgress" ADD CONSTRAINT "TrainingProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "TrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

