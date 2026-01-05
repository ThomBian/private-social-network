/*
  Warnings:

  - The primary key for the `Connection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ownerId,viewerId]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Connection` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Connection" DROP CONSTRAINT "Connection_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Connection_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_ownerId_viewerId_key" ON "Connection"("ownerId", "viewerId");
