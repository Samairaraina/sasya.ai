-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Backfill: the existing demo farms need an owner
INSERT INTO "User" ("id", "email", "password", "name") VALUES
('demo-user-green-valley', 'demo@example.com', '$2a$10$YOtRcX0FGd1ZNPHFQElg4.FNMvHlCA2ZEcvazF.DaL/gC3BvxcoAC', 'Demo Farmer');

-- AlterTable
ALTER TABLE "Crop" ADD COLUMN     "health" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Backfill existing rows, then enforce NOT NULL
UPDATE "Crop" SET "updatedAt" = "createdAt";

ALTER TABLE "Crop" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "userId" TEXT;

-- Backfill existing rows, then enforce NOT NULL
UPDATE "Farm" SET "userId" = 'demo-user-green-valley';

ALTER TABLE "Farm" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
