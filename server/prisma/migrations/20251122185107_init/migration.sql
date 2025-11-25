-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'AGENT_SAISIE', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRoleType" NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastVisite" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typeparc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Typeparc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeparcId" INTEGER NOT NULL,

    CONSTRAINT "Parc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typeconsommationlub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Typeconsommationlub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeconsommationlub_parc" (
    "parc_id" INTEGER NOT NULL,
    "typeconsommationlub_id" INTEGER NOT NULL,

    CONSTRAINT "typeconsommationlub_parc_pkey" PRIMARY KEY ("parc_id","typeconsommationlub_id")
);

-- CreateTable
CREATE TABLE "lubrifiant_parc" (
    "parc_id" INTEGER NOT NULL,
    "lubrifiant_id" INTEGER NOT NULL,

    CONSTRAINT "lubrifiant_parc_pkey" PRIMARY KEY ("parc_id","lubrifiant_id")
);

-- CreateTable
CREATE TABLE "Engin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parcId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,
    "initialHeureChassis" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Engin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typepanne" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Typepanne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepanne_parc" (
    "parc_id" INTEGER NOT NULL,
    "typepanne_id" INTEGER NOT NULL,

    CONSTRAINT "typepanne_parc_pkey" PRIMARY KEY ("parc_id","typepanne_id")
);

-- CreateTable
CREATE TABLE "Panne" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typepanneId" INTEGER NOT NULL,

    CONSTRAINT "Panne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saisiehrm" (
    "id" SERIAL NOT NULL,
    "du" TIMESTAMP(3) NOT NULL,
    "enginId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,
    "hrm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Saisiehrm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saisiehim" (
    "id" SERIAL NOT NULL,
    "panneId" INTEGER NOT NULL,
    "him" DOUBLE PRECISION NOT NULL,
    "ni" INTEGER NOT NULL,
    "saisiehrmId" INTEGER NOT NULL,
    "obs" TEXT,
    "enginId" INTEGER,

    CONSTRAINT "Saisiehim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typelubrifiant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Typelubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lubrifiant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typelubrifiantId" INTEGER NOT NULL,

    CONSTRAINT "Lubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saisielubrifiant" (
    "id" SERIAL NOT NULL,
    "lubrifiantId" INTEGER NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "obs" TEXT,
    "saisiehimId" INTEGER NOT NULL,
    "typeconsommationlubId" INTEGER,

    CONSTRAINT "Saisielubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objectif" (
    "id" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "parcId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,
    "dispo" DOUBLE PRECISION,
    "mtbf" DOUBLE PRECISION,
    "tdm" DOUBLE PRECISION,
    "spe_huile" DOUBLE PRECISION,
    "spe_go" DOUBLE PRECISION,
    "spe_graisse" DOUBLE PRECISION,

    CONSTRAINT "Objectif_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Typeparc_name_key" ON "Typeparc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Parc_name_key" ON "Parc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Typeconsommationlub_name_key" ON "Typeconsommationlub"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Engin_name_key" ON "Engin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Typepanne_name_key" ON "Typepanne"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Panne_name_key" ON "Panne"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Saisiehrm_du_enginId_key" ON "Saisiehrm"("du", "enginId");

-- CreateIndex
CREATE UNIQUE INDEX "Saisiehim_panneId_saisiehrmId_key" ON "Saisiehim"("panneId", "saisiehrmId");

-- CreateIndex
CREATE UNIQUE INDEX "Typelubrifiant_name_key" ON "Typelubrifiant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lubrifiant_name_key" ON "Lubrifiant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Objectif_annee_parcId_siteId_key" ON "Objectif"("annee", "parcId", "siteId");

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
