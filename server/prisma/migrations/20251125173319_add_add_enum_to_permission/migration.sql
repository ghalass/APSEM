/*
  Warnings:

  - The `action` column on the `permission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "action",
ADD COLUMN     "action" "Action";

-- CreateIndex
CREATE UNIQUE INDEX "permission_resource_action_key" ON "permission"("resource", "action");
