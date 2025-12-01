-- CreateEnum
CREATE TYPE "StatutEngin" AS ENUM ('ACTIF', 'INACTIF', 'EN_MAINTENANCE', 'HORS_SERVICE');

-- CreateEnum
CREATE TYPE "SourceAnomalie" AS ENUM ('VS', 'VJ', 'AUTRE');

-- CreateEnum
CREATE TYPE "Priorite" AS ENUM ('ELEVEE', 'MOYENNE', 'FAIBLE');

-- CreateEnum
CREATE TYPE "StatutAnomalie" AS ENUM ('ATTENTE_PDR', 'PDR_PRET', 'NON_PROGRAMMEE', 'PROGRAMMEE', 'EXECUTE');

-- CreateTable
CREATE TABLE "anomalies" (
    "id" TEXT NOT NULL,
    "numeroBacklog" TEXT NOT NULL,
    "dateDetection" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "source" "SourceAnomalie" NOT NULL,
    "priorite" "Priorite" NOT NULL,
    "besoinPDR" BOOLEAN NOT NULL DEFAULT false,
    "quantite" INTEGER,
    "reference" TEXT,
    "code" TEXT,
    "stock" TEXT,
    "numeroBS" TEXT,
    "programmation" TEXT,
    "sortiePDR" TEXT,
    "equipe" TEXT,
    "statut" "StatutAnomalie" NOT NULL,
    "dateExecution" TIMESTAMP(3),
    "confirmation" TEXT,
    "observations" TEXT,
    "enginId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomalies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historique_statut_anomalies" (
    "id" TEXT NOT NULL,
    "anomalieId" TEXT NOT NULL,
    "ancienStatut" "StatutAnomalie" NOT NULL,
    "nouveauStatut" "StatutAnomalie" NOT NULL,
    "dateChangement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT,

    CONSTRAINT "historique_statut_anomalies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anomalies_numeroBacklog_key" ON "anomalies"("numeroBacklog");

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historique_statut_anomalies" ADD CONSTRAINT "historique_statut_anomalies_anomalieId_fkey" FOREIGN KEY ("anomalieId") REFERENCES "anomalies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
