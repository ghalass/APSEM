/*
  Warnings:

  - You are about to drop the `anomalies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historique_statut_anomalies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "anomalies" DROP CONSTRAINT "anomalies_enginId_fkey";

-- DropForeignKey
ALTER TABLE "anomalies" DROP CONSTRAINT "anomalies_siteId_fkey";

-- DropForeignKey
ALTER TABLE "historique_statut_anomalies" DROP CONSTRAINT "historique_statut_anomalies_anomalieId_fkey";

-- DropTable
DROP TABLE "anomalies";

-- DropTable
DROP TABLE "historique_statut_anomalies";

-- CreateTable
CREATE TABLE "anomalie" (
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

    CONSTRAINT "anomalie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historique_statut_anomalie" (
    "id" TEXT NOT NULL,
    "anomalieId" TEXT NOT NULL,
    "ancienStatut" "StatutAnomalie" NOT NULL,
    "nouveauStatut" "StatutAnomalie" NOT NULL,
    "dateChangement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT,

    CONSTRAINT "historique_statut_anomalie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anomalie_numeroBacklog_key" ON "anomalie"("numeroBacklog");

-- AddForeignKey
ALTER TABLE "anomalie" ADD CONSTRAINT "anomalie_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalie" ADD CONSTRAINT "anomalie_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historique_statut_anomalie" ADD CONSTRAINT "historique_statut_anomalie_anomalieId_fkey" FOREIGN KEY ("anomalieId") REFERENCES "anomalie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
