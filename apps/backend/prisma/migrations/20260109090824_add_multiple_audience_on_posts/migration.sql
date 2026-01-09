/*
  Warnings:

  - The values [ALL] on the enum `PostAudience` will be removed. If these variants are still used in the database, this will fail.
  - Changed the column `audience` on the `Post` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostAudience_new" AS ENUM ('FAMILY', 'FRIENDS', 'OTHERS');
ALTER TABLE "public"."Post" ALTER COLUMN "audience" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "audience" TYPE TEXT;
ALTER TYPE "PostAudience" RENAME TO "PostAudience_old";
ALTER TYPE "PostAudience_new" RENAME TO "PostAudience";
DROP TYPE "public"."PostAudience_old";
COMMIT;

-- AlterTable
BEGIN;
ALTER TABLE "public"."Post" ADD COLUMN "audience__tmp" TEXT;
UPDATE "public"."Post" SET "audience__tmp" = audience WHERE audience IS NOT NULL;
ALTER TABLE "public"."Post" DROP COLUMN "audience";
ALTER TABLE "Post" ADD COLUMN "audience" "PostAudience"[] DEFAULT ARRAY['FAMILY']::"PostAudience"[];
UPDATE "public"."Post"
SET "audience" = ARRAY["audience__tmp"]::"PostAudience"[]
WHERE "audience__tmp" IS NOT NULL;
ALTER TABLE "public"."Post" DROP COLUMN "audience__tmp";
COMMIT;