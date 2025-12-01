/*
  Warnings:

  - You are about to drop the `Engin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lubrifiant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Objectif` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Panne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saisiehim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saisiehrm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saisielubrifiant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Site` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Typeconsommationlub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Typelubrifiant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Typepanne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Typeparc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typeconsommationlub_parc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `lubrifiant_parc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `typepanne_parc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Engin" DROP CONSTRAINT "Engin_parcId_fkey";

-- DropForeignKey
ALTER TABLE "Engin" DROP CONSTRAINT "Engin_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Lubrifiant" DROP CONSTRAINT "Lubrifiant_typelubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "Objectif" DROP CONSTRAINT "Objectif_parcId_fkey";

-- DropForeignKey
ALTER TABLE "Objectif" DROP CONSTRAINT "Objectif_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Panne" DROP CONSTRAINT "Panne_typepanneId_fkey";

-- DropForeignKey
ALTER TABLE "Parc" DROP CONSTRAINT "Parc_typeparcId_fkey";

-- DropForeignKey
ALTER TABLE "Saisiehim" DROP CONSTRAINT "Saisiehim_enginId_fkey";

-- DropForeignKey
ALTER TABLE "Saisiehim" DROP CONSTRAINT "Saisiehim_panneId_fkey";

-- DropForeignKey
ALTER TABLE "Saisiehim" DROP CONSTRAINT "Saisiehim_saisiehrmId_fkey";

-- DropForeignKey
ALTER TABLE "Saisiehrm" DROP CONSTRAINT "Saisiehrm_enginId_fkey";

-- DropForeignKey
ALTER TABLE "Saisiehrm" DROP CONSTRAINT "Saisiehrm_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Saisielubrifiant" DROP CONSTRAINT "Saisielubrifiant_lubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "Saisielubrifiant" DROP CONSTRAINT "Saisielubrifiant_saisiehimId_fkey";

-- DropForeignKey
ALTER TABLE "Saisielubrifiant" DROP CONSTRAINT "Saisielubrifiant_typeconsommationlubId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_lubrifiant_id_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_parc_id_fkey";

-- DropForeignKey
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_parc_id_fkey";

-- DropForeignKey
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_typeconsommationlub_id_fkey";

-- DropForeignKey
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_parc_id_fkey";

-- DropForeignKey
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_typepanne_id_fkey";

-- AlterTable
ALTER TABLE "lubrifiant_parc" ADD COLUMN     "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "typepanne_parc" ADD COLUMN     "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Engin";

-- DropTable
DROP TABLE "Lubrifiant";

-- DropTable
DROP TABLE "Objectif";

-- DropTable
DROP TABLE "Panne";

-- DropTable
DROP TABLE "Parc";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Saisiehim";

-- DropTable
DROP TABLE "Saisiehrm";

-- DropTable
DROP TABLE "Saisielubrifiant";

-- DropTable
DROP TABLE "Site";

-- DropTable
DROP TABLE "Typeconsommationlub";

-- DropTable
DROP TABLE "Typelubrifiant";

-- DropTable
DROP TABLE "Typepanne";

-- DropTable
DROP TABLE "Typeparc";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "typeconsommationlub_parc";

-- DropEnum
DROP TYPE "UserRoleType";

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeparc" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typeparc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parc" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeparcId" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeconsommation_lub" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typeconsommation_lub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeconsommation_lub_parc" (
    "parc_id" TEXT NOT NULL,
    "typeconsommationlub_id" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typeconsommation_lub_parc_pkey" PRIMARY KEY ("parc_id","typeconsommationlub_id")
);

-- CreateTable
CREATE TABLE "engin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parcId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "initialHeureChassis" DOUBLE PRECISION DEFAULT 0,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepanne" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typepanne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panne" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typepanneId" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisie_hrm" (
    "id" TEXT NOT NULL,
    "du" TIMESTAMP(3) NOT NULL,
    "enginId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "hrm" DOUBLE PRECISION NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saisie_hrm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisie_him" (
    "id" TEXT NOT NULL,
    "panneId" TEXT NOT NULL,
    "him" DOUBLE PRECISION NOT NULL,
    "ni" INTEGER NOT NULL,
    "saisiehrmId" TEXT NOT NULL,
    "obs" TEXT,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enginId" TEXT,

    CONSTRAINT "saisie_him_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_lubrifiant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_lubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lubrifiant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typelubrifiantId" TEXT NOT NULL,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisie_lubrifiant" (
    "id" TEXT NOT NULL,
    "lubrifiantId" TEXT NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "obs" TEXT,
    "saisiehimId" TEXT NOT NULL,
    "typeconsommationlubId" TEXT,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saisie_lubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectif" (
    "id" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "parcId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "dispo" DOUBLE PRECISION,
    "mtbf" DOUBLE PRECISION,
    "tdm" DOUBLE PRECISION,
    "spe_huile" DOUBLE PRECISION,
    "spe_go" DOUBLE PRECISION,
    "spe_graisse" DOUBLE PRECISION,
    "createddAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objectif_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "site_name_key" ON "site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typeparc_name_key" ON "typeparc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "parc_name_key" ON "parc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typeconsommation_lub_name_key" ON "typeconsommation_lub"("name");

-- CreateIndex
CREATE UNIQUE INDEX "engin_name_key" ON "engin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typepanne_name_key" ON "typepanne"("name");

-- CreateIndex
CREATE UNIQUE INDEX "panne_name_key" ON "panne"("name");

-- CreateIndex
CREATE UNIQUE INDEX "saisie_hrm_du_enginId_key" ON "saisie_hrm"("du", "enginId");

-- CreateIndex
CREATE UNIQUE INDEX "saisie_him_panneId_saisiehrmId_key" ON "saisie_him"("panneId", "saisiehrmId");

-- CreateIndex
CREATE UNIQUE INDEX "type_lubrifiant_name_key" ON "type_lubrifiant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lubrifiant_name_key" ON "lubrifiant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "objectif_annee_parcId_siteId_key" ON "objectif"("annee", "parcId", "siteId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parc" ADD CONSTRAINT "parc_typeparcId_fkey" FOREIGN KEY ("typeparcId") REFERENCES "typeparc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommation_lub_parc" ADD CONSTRAINT "typeconsommation_lub_parc_parc_id_fkey" FOREIGN KEY ("parc_id") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommation_lub_parc" ADD CONSTRAINT "typeconsommation_lub_parc_typeconsommationlub_id_fkey" FOREIGN KEY ("typeconsommationlub_id") REFERENCES "typeconsommation_lub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_parc_id_fkey" FOREIGN KEY ("parc_id") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_lubrifiant_id_fkey" FOREIGN KEY ("lubrifiant_id") REFERENCES "lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engin" ADD CONSTRAINT "engin_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engin" ADD CONSTRAINT "engin_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_parc_id_fkey" FOREIGN KEY ("parc_id") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_typepanne_id_fkey" FOREIGN KEY ("typepanne_id") REFERENCES "typepanne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panne" ADD CONSTRAINT "panne_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "typepanne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_hrm" ADD CONSTRAINT "saisie_hrm_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_hrm" ADD CONSTRAINT "saisie_hrm_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_him" ADD CONSTRAINT "saisie_him_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "panne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_him" ADD CONSTRAINT "saisie_him_saisiehrmId_fkey" FOREIGN KEY ("saisiehrmId") REFERENCES "saisie_hrm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_him" ADD CONSTRAINT "saisie_him_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant" ADD CONSTRAINT "lubrifiant_typelubrifiantId_fkey" FOREIGN KEY ("typelubrifiantId") REFERENCES "type_lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_lubrifiant" ADD CONSTRAINT "saisie_lubrifiant_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_lubrifiant" ADD CONSTRAINT "saisie_lubrifiant_saisiehimId_fkey" FOREIGN KEY ("saisiehimId") REFERENCES "saisie_him"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisie_lubrifiant" ADD CONSTRAINT "saisie_lubrifiant_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "typeconsommation_lub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectif" ADD CONSTRAINT "objectif_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectif" ADD CONSTRAINT "objectif_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
