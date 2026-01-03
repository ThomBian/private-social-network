-- CreateEnum
CREATE TYPE "PostAudience" AS ENUM ('FAMILY', 'FRIENDS', 'ALL');

-- CreateEnum
CREATE TYPE "RelationGroup" AS ENUM ('FAMILY', 'FRIENDS', 'OTHERS');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "audience" "PostAudience" NOT NULL DEFAULT 'FAMILY';

-- CreateTable
CREATE TABLE "Connection" (
    "ownerId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "group" "RelationGroup" NOT NULL DEFAULT 'OTHERS',
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("ownerId","viewerId")
);

-- CreateIndex
CREATE INDEX "Connection_viewerId_status_group_idx" ON "Connection"("viewerId", "status", "group");

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
