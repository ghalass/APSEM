/*
  Warnings:

  - You are about to drop the column `name` on the `permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resource,action]` on the table `permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "permission_name_key";

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "name",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "resource" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permission_resource_action_key" ON "permission"("resource", "action");
