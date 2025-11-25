/*
  Warnings:

  - The primary key for the `Engin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Lubrifiant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Objectif` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Panne` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Parc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Saisiehim` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Saisiehrm` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Saisielubrifiant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Site` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Typeconsommationlub` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Typelubrifiant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Typepanne` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Typeparc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lubrifiant_parc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `typeconsommationlub_parc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `typepanne_parc` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
ALTER TABLE "Engin" DROP CONSTRAINT "Engin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parcId" SET DATA TYPE TEXT,
ALTER COLUMN "siteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Engin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Engin_id_seq";

-- AlterTable
ALTER TABLE "Lubrifiant" DROP CONSTRAINT "Lubrifiant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "typelubrifiantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lubrifiant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Lubrifiant_id_seq";

-- AlterTable
ALTER TABLE "Objectif" DROP CONSTRAINT "Objectif_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parcId" SET DATA TYPE TEXT,
ALTER COLUMN "siteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Objectif_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Objectif_id_seq";

-- AlterTable
ALTER TABLE "Panne" DROP CONSTRAINT "Panne_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "typepanneId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Panne_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Panne_id_seq";

-- AlterTable
ALTER TABLE "Parc" DROP CONSTRAINT "Parc_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "typeparcId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Parc_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Parc_id_seq";

-- AlterTable
ALTER TABLE "Saisiehim" DROP CONSTRAINT "Saisiehim_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "panneId" SET DATA TYPE TEXT,
ALTER COLUMN "saisiehrmId" SET DATA TYPE TEXT,
ALTER COLUMN "enginId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Saisiehim_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Saisiehim_id_seq";

-- AlterTable
ALTER TABLE "Saisiehrm" DROP CONSTRAINT "Saisiehrm_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "enginId" SET DATA TYPE TEXT,
ALTER COLUMN "siteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Saisiehrm_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Saisiehrm_id_seq";

-- AlterTable
ALTER TABLE "Saisielubrifiant" DROP CONSTRAINT "Saisielubrifiant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "lubrifiantId" SET DATA TYPE TEXT,
ALTER COLUMN "saisiehimId" SET DATA TYPE TEXT,
ALTER COLUMN "typeconsommationlubId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Saisielubrifiant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Saisielubrifiant_id_seq";

-- AlterTable
ALTER TABLE "Site" DROP CONSTRAINT "Site_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Site_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Site_id_seq";

-- AlterTable
ALTER TABLE "Typeconsommationlub" DROP CONSTRAINT "Typeconsommationlub_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Typeconsommationlub_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Typeconsommationlub_id_seq";

-- AlterTable
ALTER TABLE "Typelubrifiant" DROP CONSTRAINT "Typelubrifiant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Typelubrifiant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Typelubrifiant_id_seq";

-- AlterTable
ALTER TABLE "Typepanne" DROP CONSTRAINT "Typepanne_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Typepanne_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Typepanne_id_seq";

-- AlterTable
ALTER TABLE "Typeparc" DROP CONSTRAINT "Typeparc_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Typeparc_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Typeparc_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_pkey",
ALTER COLUMN "parc_id" SET DATA TYPE TEXT,
ALTER COLUMN "lubrifiant_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "lubrifiant_parc_pkey" PRIMARY KEY ("parc_id", "lubrifiant_id");

-- AlterTable
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_pkey",
ALTER COLUMN "parc_id" SET DATA TYPE TEXT,
ALTER COLUMN "typeconsommationlub_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "typeconsommationlub_parc_pkey" PRIMARY KEY ("parc_id", "typeconsommationlub_id");

-- AlterTable
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_pkey",
ALTER COLUMN "parc_id" SET DATA TYPE TEXT,
ALTER COLUMN "typepanne_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "typepanne_parc_pkey" PRIMARY KEY ("parc_id", "typepanne_id");

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parc" ADD CONSTRAINT "Parc_typeparcId_fkey" FOREIGN KEY ("typeparcId") REFERENCES "Typeparc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_parc_id_fkey" FOREIGN KEY ("parc_id") REFERENCES "Parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_typeconsommationlub_id_fkey" FOREIGN KEY ("typeconsommationlub_id") REFERENCES "Typeconsommationlub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_parc_id_fkey" FOREIGN KEY ("parc_id") REFERENCES "Parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_lubrifiant_id_fkey" FOREIGN KEY ("lubrifiant_id") REFERENCES "Lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engin" ADD CONSTRAINT "Engin_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "Parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engin" ADD CONSTRAINT "Engin_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_parc_id_fkey" FOREIGN KEY ("parc_id") REFERENCES "Parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_typepanne_id_fkey" FOREIGN KEY ("typepanne_id") REFERENCES "Typepanne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panne" ADD CONSTRAINT "Panne_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "Typepanne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisiehrm" ADD CONSTRAINT "Saisiehrm_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "Engin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisiehrm" ADD CONSTRAINT "Saisiehrm_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisiehim" ADD CONSTRAINT "Saisiehim_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "Panne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisiehim" ADD CONSTRAINT "Saisiehim_saisiehrmId_fkey" FOREIGN KEY ("saisiehrmId") REFERENCES "Saisiehrm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisiehim" ADD CONSTRAINT "Saisiehim_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "Engin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lubrifiant" ADD CONSTRAINT "Lubrifiant_typelubrifiantId_fkey" FOREIGN KEY ("typelubrifiantId") REFERENCES "Typelubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisielubrifiant" ADD CONSTRAINT "Saisielubrifiant_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "Lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisielubrifiant" ADD CONSTRAINT "Saisielubrifiant_saisiehimId_fkey" FOREIGN KEY ("saisiehimId") REFERENCES "Saisiehim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saisielubrifiant" ADD CONSTRAINT "Saisielubrifiant_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "Typeconsommationlub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objectif" ADD CONSTRAINT "Objectif_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "Parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objectif" ADD CONSTRAINT "Objectif_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
