const prisma = require("../config/prismaClient");
const HttpStatus = require("../helpers/httpStatus");
const getDashboard = async (req, res) => {
  try {
    // Récupérer toutes les statistiques en parallèle pour de meilleures performances
    const [
      // Comptes de base
      usersCount,
      rolesCount,
      permissionsCount,
      sitesCount,
      typeParcsCount,
      parcsCount,
      enginsCount,
      typePannesCount,
      pannesCount,
      typeLubrifiantsCount,
      lubrifiantsCount,
      typeConsommationLubsCount,
      activeEnginsCount,
      recentSaisiesHrm,
      recentSaisiesHim,
      enginsByParc,
      allSaisiesLast6Months,
      anomaliesCount, // NOUVEAU: Statistiques anomalies

      // Statistiques avancées
      inactiveEnginsCount,
      inactiveUsersCount,
      topPannes,
      topLubrifiants,
      recentUsers,
      anomaliesBySource, // NOUVEAU: Anomalies par source
      anomaliesByStatus, // NOUVEAU: Anomalies par statut
    ] = await Promise.all([
      // Comptes de base
      prisma.user.count(),
      prisma.role.count(),
      prisma.permission.count(),
      prisma.site.count(),
      prisma.typeparc.count(),
      prisma.parc.count(),
      prisma.engin.count(),
      prisma.typepanne.count(),
      prisma.panne.count(),
      prisma.typelubrifiant.count(),
      prisma.lubrifiant.count(),
      prisma.typeconsommationlub.count(),
      prisma.engin.count({ where: { active: true } }),

      // Données récentes
      prisma.saisiehrm.findMany({
        take: 5,
        orderBy: { createddAt: "desc" },
        include: {
          Engin: { select: { name: true } },
          Site: { select: { name: true } },
        },
      }),

      prisma.saisiehim.findMany({
        take: 5,
        orderBy: { createddAt: "desc" },
        include: {
          Panne: { select: { name: true } },
          Saisiehrm: {
            include: {
              Engin: { select: { name: true } },
            },
          },
        },
      }),

      prisma.engin.groupBy({
        by: ["parcId"],
        _count: { id: true },
        where: { active: true },
      }),

      // Saisies pour groupement manuel par mois
      prisma.saisiehrm.findMany({
        where: {
          du: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
        select: {
          du: true,
        },
        orderBy: { du: "asc" },
      }),

      // NOUVEAU: Statistiques anomalies
      prisma.anomalie.count(),

      // Statistiques supplémentaires
      prisma.engin.count({ where: { active: false } }),
      prisma.user.count({ where: { active: false } }),

      // Top pannes
      prisma.saisiehim.groupBy({
        by: ["panneId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),

      // Top lubrifiants
      prisma.saisielubrifiant.groupBy({
        by: ["lubrifiantId"],
        _sum: { qte: true },
        orderBy: { _sum: { qte: "desc" } },
        take: 5,
      }),

      // Derniers utilisateurs
      prisma.user.findMany({
        take: 5,
        orderBy: { createddAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          active: true,
          createddAt: true,
          roles: { select: { name: true } },
        },
      }),

      // NOUVEAU: Anomalies par source
      prisma.anomalie.groupBy({
        by: ["source"],
        _count: { id: true },
      }),

      // NOUVEAU: Anomalies par statut
      prisma.anomalie.groupBy({
        by: ["statut"],
        _count: { id: true },
      }),
    ]);

    // Grouper manuellement les saisies par mois
    const saisiesByMonth = Object.values(
      allSaisiesLast6Months.reduce((acc, saisie) => {
        const month = saisie.du.toISOString().slice(0, 7); // Format "YYYY-MM"
        if (!acc[month]) {
          acc[month] = { month, count: 0 };
        }
        acc[month].count++;
        return acc;
      }, {})
    ).sort((a, b) => a.month.localeCompare(b.month));

    // Enrichir les données avec les noms pour les tops
    const enrichedTopPannes = await Promise.all(
      topPannes.map(async (item) => {
        const panne = await prisma.panne.findUnique({
          where: { id: item.panneId },
          select: { name: true, typepanneId: true },
        });
        const typePanne = await prisma.typepanne.findUnique({
          where: { id: panne?.typepanneId },
          select: { name: true },
        });
        return {
          panneName: panne?.name || "Unknown",
          typePanneName: typePanne?.name || "Unknown",
          occurrenceCount: item._count.id,
        };
      })
    );

    const enrichedTopLubrifiants = await Promise.all(
      topLubrifiants.map(async (item) => {
        const lubrifiant = await prisma.lubrifiant.findUnique({
          where: { id: item.lubrifiantId },
          select: { name: true, typelubrifiantId: true },
        });
        const typeLubrifiant = await prisma.typelubrifiant.findUnique({
          where: { id: lubrifiant?.typelubrifiantId },
          select: { name: true },
        });
        return {
          lubrifiantName: lubrifiant?.name || "Unknown",
          typeLubrifiantName: typeLubrifiant?.name || "Unknown",
          totalQuantity: item._sum.qte || 0,
        };
      })
    );

    // Enrichir la distribution des engins par parc
    const enrichedEnginsDistribution = await Promise.all(
      enginsByParc.map(async (item) => {
        const parc = await prisma.parc.findUnique({
          where: { id: item.parcId },
          select: { name: true, typeparcId: true },
        });
        const typeParc = await prisma.typeparc.findUnique({
          where: { id: parc?.typeparcId },
          select: { name: true },
        });
        return {
          parcName: parc?.name || "Unknown",
          typeParcName: typeParc?.name || "Unknown",
          enginsCount: item._count.id,
        };
      })
    );

    // Calculer les pourcentages
    const activeEnginsPercentage =
      enginsCount > 0 ? Math.round((activeEnginsCount / enginsCount) * 100) : 0;

    // NOUVEAU: Calculer les statistiques anomalies
    const anomaliesBySourceFormatted = anomaliesBySource.reduce((acc, item) => {
      acc[item.source] = item._count.id;
      return acc;
    }, {});

    const anomaliesByStatusFormatted = anomaliesByStatus.reduce((acc, item) => {
      acc[item.statut] = item._count.id;
      return acc;
    }, {});

    // Calculer le taux de résolution (anomalies exécutées)
    const anomaliesResolues = anomaliesByStatusFormatted["EXECUTE"] || 0;
    const tauxResolution =
      anomaliesCount > 0
        ? Math.round((anomaliesResolues / anomaliesCount) * 100)
        : 0;

    // Structurer la réponse finale
    const dashboardStats = {
      // Vue d'ensemble
      overview: {
        totalUsers: usersCount,
        totalInactiveUsers: inactiveUsersCount,
        totalRoles: rolesCount,
        totalPermissions: permissionsCount,
        totalSites: sitesCount,
        totalParcs: parcsCount,
        totalEngins: enginsCount,
        totalActiveEngins: activeEnginsCount,
        totalInactiveEngins: inactiveEnginsCount,
        totalPannes: pannesCount,
        totalLubrifiants: lubrifiantsCount,
        totalAnomalies: anomaliesCount, // NOUVEAU
        anomaliesResolues: anomaliesResolues, // NOUVEAU
        tauxResolution: tauxResolution, // NOUVEAU
      },

      // Catégories
      categories: {
        typeParcs: typeParcsCount,
        typePannes: typePannesCount,
        typeLubrifiants: typeLubrifiantsCount,
        typeConsommationLubs: typeConsommationLubsCount,
      },

      // Distribution et analytiques
      distribution: {
        enginsByParc: enrichedEnginsDistribution,
        activeEnginsPercentage: activeEnginsPercentage,
        anomaliesBySource: anomaliesBySourceFormatted, // NOUVEAU
        anomaliesByStatus: anomaliesByStatusFormatted, // NOUVEAU
      },

      // Top et classements
      rankings: {
        topPannes: enrichedTopPannes,
        topLubrifiants: enrichedTopLubrifiants,
      },

      // Activité récente
      recentActivity: {
        lastSaisiesHrm: recentSaisiesHrm.map((saisie) => ({
          id: saisie.id,
          engin: saisie.Engin.name,
          site: saisie.Site.name,
          hrm: saisie.hrm,
          date: saisie.du,
          createdAt: saisie.createddAt,
        })),
        lastSaisiesHim: recentSaisiesHim.map((saisie) => ({
          id: saisie.id,
          panne: saisie.Panne.name,
          engin: saisie.Saisiehrm?.Engin?.name || "N/A",
          him: saisie.him,
          ni: saisie.ni,
          createdAt: saisie.createddAt,
        })),
        recentUsers: recentUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          active: user.active,
          roles: user.roles.map((role) => role.name),
          createdAt: user.createddAt,
        })),
      },

      // Tendances temporelles
      trends: {
        saisiesByMonth: saisiesByMonth,
      },
    };

    res.status(HttpStatus.OK).json({
      success: true,
      data: dashboardStats,
      message: "Dashboard statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
