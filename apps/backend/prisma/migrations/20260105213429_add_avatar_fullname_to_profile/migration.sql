-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "fullName" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;
