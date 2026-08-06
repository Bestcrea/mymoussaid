-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "status" "AccountStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "users" ADD COLUMN "accountType" TEXT;
ALTER TABLE "users" ADD COLUMN "civility" TEXT;
ALTER TABLE "users" ADD COLUMN "cinNumber" TEXT;
ALTER TABLE "users" ADD COLUMN "firstNameAr" TEXT;
ALTER TABLE "users" ADD COLUMN "lastNameAr" TEXT;
ALTER TABLE "users" ADD COLUMN "address" TEXT;
ALTER TABLE "users" ADD COLUMN "licenseNumber" TEXT;
ALTER TABLE "users" ADD COLUMN "regionalCouncil" TEXT;
ALTER TABLE "users" ADD COLUMN "billingType" TEXT;
ALTER TABLE "users" ADD COLUMN "billingName" TEXT;
ALTER TABLE "users" ADD COLUMN "billingCity" TEXT;
ALTER TABLE "users" ADD COLUMN "billingAddress" TEXT;
ALTER TABLE "users" ADD COLUMN "billingCin" TEXT;
ALTER TABLE "users" ADD COLUMN "billingIce" TEXT;
ALTER TABLE "users" ADD COLUMN "billingRc" TEXT;
ALTER TABLE "users" ADD COLUMN "rejectionReason" TEXT;
ALTER TABLE "users" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "rejectedAt" TIMESTAMP(3);

-- Existing accounts stay usable
UPDATE "users" SET "status" = 'APPROVED', "approvedAt" = CURRENT_TIMESTAMP, "isVerified" = true;
