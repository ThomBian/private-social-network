/*
  Warnings:

  - The values [tiny,big] on the enum `PostSize` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostSize_new" AS ENUM ('rectangle', 'square');
ALTER TABLE "public"."Post" ALTER COLUMN "size" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "size" TYPE "PostSize_new" USING ("size"::text::"PostSize_new");
ALTER TYPE "PostSize" RENAME TO "PostSize_old";
ALTER TYPE "PostSize_new" RENAME TO "PostSize";
DROP TYPE "public"."PostSize_old";
ALTER TABLE "Post" ALTER COLUMN "size" SET DEFAULT 'rectangle';
COMMIT;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "size" SET DEFAULT 'rectangle';
