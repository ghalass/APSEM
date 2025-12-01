const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
// Fonction utilitaire pour parser les dates
const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Créer une nouvelle anomalie
// Créer une nouvelle anomalie
const createAnomalie = async (req, res) => {
  try {
    const {
      numeroBacklog,
      dateDetection,
      description,
      source,
      priorite,
      besoinPDR = false,
      quantite,
      reference,
      code,
      stock,
      numeroBS,
      programmation,
      sortiePDR,
      equipe,
      statut,
      dateExecution,
      confirmation,
      observations,
      enginId,
      siteId,
    } = req.body;

    // Vérifier que les champs requis sont présents
    const requiredFields = [
      "numeroBacklog",
      "dateDetection",
      "description",
      "source",
      "priorite",
      "statut",
      "enginId",
      "siteId",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "Champs manquants",
        details: `Les champs suivants sont requis: ${missingFields.join(", ")}`,
      });
    }

    // Parser les dates
    const parsedDateDetection = parseDate(dateDetection);
    const parsedDateExecution = parseDate(dateExecution);

    if (!parsedDateDetection) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: "Date invalide",
        details: "La date de détection est invalide",
      });
    }

    // Vérifier si l'engin existe
    const enginExists = await prisma.engin.findUnique({
      where: { id: enginId },
    });

    if (!enginExists) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Engin non trouvé",
        details: `L'engin avec l'ID ${enginId} n'existe pas`,
      });
    }

    // Vérifier si le site existe
    const siteExists = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!siteExists) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Site non trouvé",
        details: `Le site avec l'ID ${siteId} n'existe pas`,
      });
    }

    // Vérifier si le numéro de backlog existe déjà
    const existingAnomalie = await prisma.anomalie.findUnique({
      where: { numeroBacklog },
    });

    if (existingAnomalie) {
      return res.status(HttpStatus.CONFLICT).json({
        error: "Numéro de backlog déjà utilisé",
        details: `Le numéro de backlog ${numeroBacklog} existe déjà`,
      });
    }

    const anomalie = await prisma.anomalie.create({
      data: {
        numeroBacklog,
        dateDetection: parsedDateDetection,
        description,
        source,
        priorite,
        besoinPDR: Boolean(besoinPDR),
        quantite: quantite ? parseInt(quantite) : null,
        reference,
        code,
        stock,
        numeroBS,
        programmation,
        sortiePDR,
        equipe,
        statut,
        dateExecution: parsedDateExecution,
        confirmation,
        observations,
        enginId,
        siteId,
      },
      include: {
        engin: {
          include: {
            Parc: true,
            Site: true,
          },
        },
        site: true,
        historiqueStatutAnomalies: {
          orderBy: {
            dateChangement: "desc",
          },
          take: 1,
        },
      },
    });

    // Créer le premier historique de statut
    await prisma.historiqueStatutAnomalie.create({
      data: {
        anomalieId: anomalie.id,
        ancienStatut: statut,
        nouveauStatut: statut,
        commentaire: "Création de l'anomalie",
      },
    });

    res.status(HttpStatus.CREATED).json({
      message: "Anomalie créée avec succès",
      data: anomalie,
    });
  } catch (error) {
    console.error("Erreur création anomalie:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Erreur interne du serveur",
      details: error.message,
    });
  }
};

// Récupérer toutes les anomalies avec filtres
const getAnomalies = async (req, res) => {
  try {
    const {
      statut,
      priorite,
      enginId,
      siteId,
      dateDebut,
      dateFin,
      page = 1,
      limit = 50,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if (statut) where.statut = statut;
    if (priorite) where.priorite = priorite;
    if (enginId) where.enginId = enginId;
    if (siteId) where.siteId = siteId;

    if (dateDebut || dateFin) {
      where.dateDetection = {};
      if (dateDebut) {
        const parsedDateDebut = parseDate(dateDebut);
        if (parsedDateDebut) where.dateDetection.gte = parsedDateDebut;
      }
      if (dateFin) {
        const parsedDateFin = parseDate(dateFin);
        if (parsedDateFin) where.dateDetection.lte = parsedDateFin;
      }
    }

    const [anomalies, total] = await Promise.all([
      prisma.anomalie.findMany({
        where,
        include: {
          engin: {
            include: {
              Parc: true,
              Site: true,
            },
          },
          site: true,
          historiqueStatutAnomalies: {
            orderBy: {
              dateChangement: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          dateDetection: "desc",
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.anomalie.count({ where }),
    ]);

    res.json({
      message: "Anomalies récupérées avec succès",
      data: anomalies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Erreur récupération anomalies:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Erreur interne du serveur",
      details: error.message,
    });
  }
};
// Récupérer une anomalie par son ID
const getAnomalieById = async (req, res) => {
  try {
    const { id } = req.params;

    const anomalie = await prisma.anomalie.findUnique({
      where: { id },
      include: {
        engin: {
          include: {
            Parc: true, // Correction: Parc avec majuscule
            Site: true,
          },
        },
        site: true,
        historiqueStatutAnomalies: {
          orderBy: {
            dateChangement: "desc",
          },
        },
      },
    });

    if (!anomalie) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Anomalie non trouvée" });
    }

    res.json(anomalie);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// Mettre à jour une anomalie
const updateAnomalie = async (req, res) => {
  try {
    const { id } = req.params;

    // Extraire seulement les champs autorisés pour la mise à jour
    const allowedFields = [
      "numeroBacklog",
      "dateDetection",
      "description",
      "source",
      "priorite",
      "besoinPDR",
      "quantite",
      "reference",
      "code",
      "stock",
      "numeroBS",
      "programmation",
      "sortiePDR",
      "equipe",
      "statut",
      "dateExecution",
      "confirmation",
      "observations",
      "enginId",
      "siteId",
    ];

    const updateData = {};

    // Fonction pour valider et parser les dates
    const parseDate = (dateValue) => {
      if (!dateValue || dateValue === "") {
        return null;
      }

      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    };

    // Filtrer et valider les champs
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        // Gestion spéciale pour les champs de date
        if (field === "dateDetection" || field === "dateExecution") {
          const parsedDate = parseDate(req.body[field]);
          if (parsedDate) {
            updateData[field] = parsedDate;
          } else if (req.body[field] === "") {
            // Permettre de vider une date en la mettant à null
            updateData[field] = null;
          }
          // Si la date est invalide et non vide, on ne l'ajoute pas
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const anomalieExistante = await prisma.anomalie.findUnique({
      where: { id },
    });

    if (!anomalieExistante) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Anomalie non trouvée" });
    }

    // Vérifier si le statut a changé
    if (updateData.statut && updateData.statut !== anomalieExistante.statut) {
      await prisma.historiqueStatutAnomalie.create({
        data: {
          anomalieId: id,
          ancienStatut: anomalieExistante.statut,
          nouveauStatut: updateData.statut,
          commentaire: `Changement de statut: ${anomalieExistante.statut} → ${updateData.statut}`,
        },
      });
    }

    const anomalie = await prisma.anomalie.update({
      where: { id },
      data: updateData,
      include: {
        engin: {
          include: {
            Parc: true,
            Site: true,
          },
        },
        site: true,
        historiqueStatutAnomalies: {
          orderBy: {
            dateChangement: "desc",
          },
          take: 1,
        },
      },
    });

    res.json(anomalie);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'anomalie:", error);
    res.status(HttpStatus.BAD_REQUEST).json({
      error: error.message,
      details: "Vérifiez le format des dates et des champs obligatoires",
    });
  }
};

// Supprimer une anomalie
const deleteAnomalie = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprimer d'abord l'historique
    await prisma.historiqueStatutAnomalie.deleteMany({
      where: { anomalieId: id },
    });

    await prisma.anomalie.delete({
      where: { id },
    });

    res.json({ message: "Anomalie supprimée avec succès" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

// Statistiques des anomalies
const getAnomalieStats = async (req, res) => {
  try {
    const { siteId, enginId, dateDebut, dateFin } = req.query;

    const where = {};
    if (siteId) where.siteId = siteId;
    if (enginId) where.enginId = enginId;
    if (dateDebut || dateFin) {
      where.dateDetection = {};
      if (dateDebut) where.dateDetection.gte = new Date(dateDebut);
      if (dateFin) where.dateDetection.lte = new Date(dateFin);
    }

    // Récupérer toutes les anomalies avec les relations CORRIGÉES
    const anomalies = await prisma.anomalie.findMany({
      where,
      include: {
        engin: {
          select: {
            name: true,
            Parc: {
              // Correction: Parc avec majuscule
              select: { name: true },
            },
          },
        },
        site: {
          select: { name: true },
        },
      },
      orderBy: { dateDetection: "desc" },
    });

    // Construction manuelle de la matrice
    const matrixData = {
      total: {
        ATTENTE_PDR: 0,
        PDR_PRET: 0,
        NON_PROGRAMMEE: 0,
        PROGRAMMEE: 0,
        EXECUTE: 0,
        TOTAL: 0,
      },
      ELEVEE: {
        ATTENTE_PDR: 0,
        PDR_PRET: 0,
        NON_PROGRAMMEE: 0,
        PROGRAMMEE: 0,
        EXECUTE: 0,
        TOTAL: 0,
      },
      MOYENNE: {
        ATTENTE_PDR: 0,
        PDR_PRET: 0,
        NON_PROGRAMMEE: 0,
        PROGRAMMEE: 0,
        EXECUTE: 0,
        TOTAL: 0,
      },
      FAIBLE: {
        ATTENTE_PDR: 0,
        PDR_PRET: 0,
        NON_PROGRAMMEE: 0,
        PROGRAMMEE: 0,
        EXECUTE: 0,
        TOTAL: 0,
      },
    };

    // Statistiques par site
    const statsSites = {};
    const statsSource = {};
    const pdrStats = { avecPDR: 0, sansPDR: 0 };
    const statsEngins = {};

    const dernieresAnomalies = anomalies.slice(0, 10).map((a) => ({
      id: a.id,
      numeroBacklog: a.numeroBacklog,
      statut: a.statut,
      priorite: a.priorite,
      dateDetection: a.dateDetection,
      engin: a.engin?.name,
      site: a.site?.name,
    }));

    // Traitement de chaque anomalie
    anomalies.forEach((anomalie) => {
      const {
        statut,
        priorite,
        source,
        besoinPDR,
        siteId,
        enginId,
        site,
        engin,
      } = anomalie;

      // Matrice statut × priorité
      matrixData[priorite][statut]++;
      matrixData[priorite]["TOTAL"]++;
      matrixData.total[statut]++;
      matrixData.total["TOTAL"]++;

      // Statistiques par site
      if (!statsSites[siteId]) {
        statsSites[siteId] = {
          id: siteId,
          nom: site?.name || "Site inconnu",
          total: 0,
          parStatut: {
            ATTENTE_PDR: 0,
            PDR_PRET: 0,
            NON_PROGRAMMEE: 0,
            PROGRAMMEE: 0,
            EXECUTE: 0,
          },
        };
      }
      statsSites[siteId].parStatut[statut]++;
      statsSites[siteId].total++;

      // Statistiques par engin
      if (!statsEngins[enginId]) {
        statsEngins[enginId] = {
          id: enginId,
          nom: engin?.name || "Engin inconnu",
          parc: engin?.Parc?.name || "-", // Correction: Parc avec majuscule
          total: 0,
        };
      }
      statsEngins[enginId].total++;

      // Sources
      statsSource[source] = (statsSource[source] || 0) + 1;

      // Besoin PDR
      if (besoinPDR) {
        pdrStats.avecPDR++;
      } else {
        pdrStats.sansPDR++;
      }
    });

    // Classement des sites
    const classementSites = Object.values(statsSites)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Classement des engins
    const topEngins = Object.values(statsEngins)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // Calcul des indicateurs
    const totalAnomalies = matrixData.total.TOTAL;
    const tauxResolution =
      totalAnomalies > 0
        ? Math.round((matrixData.total.EXECUTE / totalAnomalies) * 100)
        : 0;

    const sitePlusActif =
      classementSites.length > 0 ? classementSites[0] : null;

    const result = {
      matrice: matrixData,
      indicateurs: {
        totalAnomalies,
        tauxResolution,
        anomaliesCritiques: matrixData.ELEVEE.TOTAL,
        anomaliesEnAttentePDR: matrixData.total.ATTENTE_PDR,
        anomaliesAvecPDR: pdrStats.avecPDR,
        anomaliesSansPDR: pdrStats.sansPDR,
        nombreSitesAvecAnomalies: Object.keys(statsSites).length,
        sitePlusActif: sitePlusActif
          ? {
              nom: sitePlusActif.nom,
              totalAnomalies: sitePlusActif.total,
            }
          : null,
      },
      parSite: {
        classement: classementSites,
        repartition: classementSites.map((site) => ({
          site: site.nom,
          total: site.total,
          pourcentage:
            totalAnomalies > 0
              ? Math.round((site.total / totalAnomalies) * 100)
              : 0,
        })),
        details: statsSites,
      },
      topEngins,
      repartitions: {
        parStatut: matrixData.total,
        parPriorite: {
          ELEVEE: matrixData.ELEVEE.TOTAL,
          MOYENNE: matrixData.MOYENNE.TOTAL,
          FAIBLE: matrixData.FAIBLE.TOTAL,
        },
        parSource: statsSource,
        parBesoinPDR: pdrStats,
      },
      dernieresAnomalies,
      metadata: {
        dateGeneration: new Date().toISOString(),
        filtres: { siteId, enginId, dateDebut, dateFin },
      },
    };

    res.json(result);
  } catch (error) {
    console.error("Erreur statistiques anomalies:", error);
    res.status(HttpStatus.BAD_REQUEST).json({
      error: "Erreur lors du calcul des statistiques",
      details: error.message,
    });
  }
};
module.exports = {
  createAnomalie,
  getAnomalies,
  getAnomalieById,
  updateAnomalie,
  deleteAnomalie,
  getAnomalieStats,
};
