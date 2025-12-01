const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// Récupérer l'historique d'une anomalie
const getHistoriqueByAnomalie = async (req, res) => {
  try {
    const { anomalieId } = req.params;

    const historique = await prisma.historiqueStatutAnomalie.findMany({
      where: { anomalieId },
      orderBy: {
        dateChangement: "desc",
      },
      include: {
        anomalie: {
          include: {
            engin: {
              include: {
                Parc: true, // Correction: Parc avec majuscule
                Site: true,
              },
            },
            site: true,
          },
        },
      },
    });

    res.json(historique);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// Ajouter une entrée d'historique manuellement
const createHistoriqueEntry = async (req, res) => {
  try {
    const { anomalieId, nouveauStatut, commentaire } = req.body;

    // Récupérer l'anomalie pour avoir l'ancien statut
    const anomalie = await prisma.anomalie.findUnique({
      where: { id: anomalieId },
    });

    if (!anomalie) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Anomalie non trouvée" });
    }

    const historique = await prisma.historiqueStatutAnomalie.create({
      data: {
        anomalieId,
        ancienStatut: anomalie.statut,
        nouveauStatut,
        commentaire,
      },
      include: {
        anomalie: {
          include: {
            engin: {
              include: {
                Parc: true, // Correction: Parc avec majuscule
                Site: true,
              },
            },
            site: true,
          },
        },
      },
    });

    // Mettre à jour le statut de l'anomalie
    await prisma.anomalie.update({
      where: { id: anomalieId },
      data: { statut: nouveauStatut },
    });

    res.status(HttpStatus.CREATED).json(historique);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  getHistoriqueByAnomalie,
  createHistoriqueEntry,
};
