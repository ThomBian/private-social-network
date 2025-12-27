/*
  Warnings:

  - The `size` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PostSize" AS ENUM ('tiny', 'rectangle', 'big');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "size",
ADD COLUMN     "size" "PostSize" NOT NULL DEFAULT 'tiny',
ALTER COLUMN "type" SET DEFAULT 'image';

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
