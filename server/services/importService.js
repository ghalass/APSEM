// services/importService.js
const prisma = require("../config/prismaClient");
const { convertField } = require("../helpers/utils");

class ImportService {
  constructor() {
    // Plus besoin de batchSize car traitement ligne par ligne
  }

  // Méthode principale d'import
  async importData(sheetName, data) {
    try {
      switch (sheetName.toLowerCase()) {
        case "sites":
          return await this.importSites(data);
        case "typeparcs":
          return await this.importTypeParcs(data);
        case "parcs":
          return await this.importParcs(data);
        case "engins":
          return await this.importEngins(data);
        case "typepannes":
          return await this.importTypePannes(data);
        case "pannes":
          return await this.importPannes(data);
        case "typelubrifiants":
          return await this.importTypeLubrifiants(data);
        case "lubrifiants":
          return await this.importLubrifiants(data);
        case "typeconsommationlub":
          return await this.importTypeConsommationLub(data);
        case "saisiehrm":
          return await this.importSaisieHRM(data);
        case "saisiehim":
          return await this.importSaisieHIM(data);
        case "saisielubrifiant":
          return await this.importSaisieLubrifiant(data);
        case "objectifs":
          return await this.importObjectifs(data);
        case "roles":
          return await this.importRoles(data);
        case "users":
          return await this.importUsers(data);
        default:
          throw new Error(`Onglet non supporté: ${sheetName}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'import ${sheetName}:`, error);
      throw error;
    }
  }

  // Import des Sites
  async importSites(data) {
    // console.log("Import Sites - Données:", data);

    try {
      const name = convertField(data.name, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }

      const site = await prisma.site.upsert({
        where: { name: name },
        update: {
          name: name,
          updatedAt: new Date(),
        },
        create: {
          name: name,
        },
      });

      return [
        {
          success: true,
          data: site,
          message: `Site ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des TypeParcs
  async importTypeParcs(data) {
    // console.log("Import TypeParcs - Données:", data);

    try {
      const name = convertField(data.name, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }

      const typeParc = await prisma.typeparc.upsert({
        where: { name: name },
        update: {
          name: name,
          updatedAt: new Date(),
        },
        create: {
          name: name,
        },
      });

      return [
        {
          success: true,
          data: typeParc,
          message: `TypeParc ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Parcs (avec relations)
  async importParcs(data) {
    // console.log("Import Parcs - Données:", data);

    try {
      const name = convertField(data.name, "string");
      const typeparcName = convertField(data.typeparcName, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }
      if (!typeparcName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'typeparcName' est requis`,
          },
        ];
      }

      const typeParc = await prisma.typeparc.findUnique({
        where: { name: typeparcName },
      });

      if (!typeParc) {
        return [
          {
            success: false,
            data: data,
            message: `TypeParc "${typeparcName}" non trouvé`,
          },
        ];
      }

      const parc = await prisma.parc.upsert({
        where: { name: name },
        update: {
          name: name,
          typeparcId: typeParc.id,
          updatedAt: new Date(),
        },
        create: {
          name: name,
          typeparcId: typeParc.id,
        },
      });

      return [
        {
          success: true,
          data: parc,
          message: `Parc ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Engins (avec gestion des types)
  async importEngins(data) {
    // console.log("Import Engins - Données:", data);

    try {
      // Conversion des champs avec leurs types respectifs
      const name = convertField(data.name, "string");
      const active = convertField(data.active, "boolean") ?? true;
      const initialHeureChassis =
        convertField(data.initialHeureChassis, "number") ?? 0;
      const parcName = convertField(data.parcName, "string");
      const siteName = convertField(data.siteName, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }
      if (!parcName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'parcName' est requis`,
          },
        ];
      }
      if (!siteName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'siteName' est requis`,
          },
        ];
      }

      const [parc, site] = await Promise.all([
        prisma.parc.findUnique({ where: { name: parcName } }),
        prisma.site.findUnique({ where: { name: siteName } }),
      ]);

      if (!parc) {
        return [
          {
            success: false,
            data: data,
            message: `Parc "${parcName}" non trouvé`,
          },
        ];
      }
      if (!site) {
        return [
          {
            success: false,
            data: data,
            message: `Site "${siteName}" non trouvé`,
          },
        ];
      }

      const engin = await prisma.engin.upsert({
        where: { name: name },
        update: {
          name: name,
          active: active,
          parcId: parc.id,
          siteId: site.id,
          initialHeureChassis: initialHeureChassis,
          updatedAt: new Date(),
        },
        create: {
          name: name,
          active: active,
          parcId: parc.id,
          siteId: site.id,
          initialHeureChassis: initialHeureChassis,
        },
      });

      return [
        {
          success: true,
          data: engin,
          message: `Engin ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des TypePannes
  async importTypePannes(data) {
    // console.log("Import TypePannes - Données:", data);

    try {
      const name = convertField(data.name, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }

      const typePanne = await prisma.typepanne.upsert({
        where: { name: name },
        update: {
          name: name,
          updatedAt: new Date(),
        },
        create: {
          name: name,
        },
      });

      return [
        {
          success: true,
          data: typePanne,
          message: `TypePanne ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Pannes
  async importPannes(data) {
    // console.log("Import Pannes - Données:", data);

    try {
      const name = convertField(data.name, "string");
      const typepanneName = convertField(data.typepanneName, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }
      if (!typepanneName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'typepanneName' est requis`,
          },
        ];
      }

      const typePanne = await prisma.typepanne.findUnique({
        where: { name: typepanneName },
      });

      if (!typePanne) {
        return [
          {
            success: false,
            data: data,
            message: `TypePanne "${typepanneName}" non trouvé`,
          },
        ];
      }

      const panne = await prisma.panne.upsert({
        where: { name: name },
        update: {
          name: name,
          typepanneId: typePanne.id,
          updatedAt: new Date(),
        },
        create: {
          name: name,
          typepanneId: typePanne.id,
        },
      });

      return [
        {
          success: true,
          data: panne,
          message: `Panne ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des TypeLubrifiants
  async importTypeLubrifiants(data) {
    // console.log("Import TypeLubrifiants - Données:", data);

    try {
      const name = convertField(data.name, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }

      const typeLubrifiant = await prisma.typelubrifiant.upsert({
        where: { name: name },
        update: {
          name: name,
          updatedAt: new Date(),
        },
        create: {
          name: name,
        },
      });

      return [
        {
          success: true,
          data: typeLubrifiant,
          message: `TypeLubrifiant ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Lubrifiants
  async importLubrifiants(data) {
    // console.log("Import Lubrifiants - Données:", data);

    try {
      const name = convertField(data.name, "string");
      const typelubrifiantName = convertField(
        data.typelubrifiantName,
        "string"
      );

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }
      if (!typelubrifiantName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'typelubrifiantName' est requis`,
          },
        ];
      }

      const typeLubrifiant = await prisma.typelubrifiant.findUnique({
        where: { name: typelubrifiantName },
      });

      if (!typeLubrifiant) {
        return [
          {
            success: false,
            data: data,
            message: `TypeLubrifiant "${typelubrifiantName}" non trouvé`,
          },
        ];
      }

      const lubrifiant = await prisma.lubrifiant.upsert({
        where: { name: name },
        update: {
          name: name,
          typelubrifiantId: typeLubrifiant.id,
          updatedAt: new Date(),
        },
        create: {
          name: name,
          typelubrifiantId: typeLubrifiant.id,
        },
      });

      return [
        {
          success: true,
          data: lubrifiant,
          message: `Lubrifiant ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des TypeConsommationLub
  async importTypeConsommationLub(data) {
    // console.log("Import TypeConsommationLub - Données:", data);

    try {
      const name = convertField(data.name, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }

      const typeConsommationLub = await prisma.typeconsommationlub.upsert({
        where: { name: name },
        update: {
          name: name,
          updatedAt: new Date(),
        },
        create: {
          name: name,
        },
      });

      return [
        {
          success: true,
          data: typeConsommationLub,
          message: `TypeConsommationLub ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des SaisieHRM (avec contraintes d'unicité)
  async importSaisieHRM(data) {
    // console.log("Import SaisieHRM - Données:", data);

    try {
      const du = convertField(data.du, "date");
      const enginName = convertField(data.enginName, "string");
      const siteName = convertField(data.siteName, "string");
      const hrm = convertField(data.hrm, "number");

      if (!du) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'du' est requis et doit être une date valide`,
          },
        ];
      }
      if (!enginName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'enginName' est requis`,
          },
        ];
      }
      if (!siteName) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'siteName' est requis`,
          },
        ];
      }
      if (hrm === null || hrm === undefined) {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'hrm' est requis`,
          },
        ];
      }

      const [engin, site] = await Promise.all([
        prisma.engin.findUnique({ where: { name: enginName } }),
        prisma.site.findUnique({ where: { name: siteName } }),
      ]);

      if (!engin) {
        return [
          {
            success: false,
            data: data,
            message: `Engin "${enginName}" non trouvé`,
          },
        ];
      }
      if (!site) {
        return [
          {
            success: false,
            data: data,
            message: `Site "${siteName}" non trouvé`,
          },
        ];
      }

      const saisieHRM = await prisma.saisiehrm.upsert({
        where: {
          du_enginId: {
            du: new Date(du),
            enginId: engin.id,
          },
        },
        update: {
          hrm: hrm,
          siteId: site.id,
          updatedAt: new Date(),
        },
        create: {
          du: new Date(du),
          enginId: engin.id,
          siteId: site.id,
          hrm: hrm,
        },
      });

      return [
        {
          success: true,
          data: saisieHRM,
          message: `SaisieHRM importée avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des SaisieHIM
  async importSaisieHIM(data) {
    // console.log("Import SaisieHIM - Données:", data);

    try {
      // Conversion des champs
      const panneName = convertField(data.panneName, "string");
      const him = convertField(data.him, "number");
      const ni = convertField(data.ni, "int");
      const saisiehrmDu = convertField(data.saisiehrmDu, "date");
      const enginName = convertField(data.enginName, "string");
      const obs = convertField(data.obs, "string");

      // Validation des champs requis
      const requiredFields = {
        panneName: panneName,
        him: him,
        ni: ni,
        saisiehrmDu: saisiehrmDu,
        enginName: enginName,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (value === null || value === undefined || value === "") {
          return [
            {
              success: false,
              data: data,
              message: `Erreur: Le champ '${field}' est requis`,
            },
          ];
        }
      }

      const [panne, engin] = await Promise.all([
        prisma.panne.findUnique({ where: { name: panneName } }),
        prisma.engin.findUnique({ where: { name: enginName } }),
      ]);

      if (!panne) {
        return [
          {
            success: false,
            data: data,
            message: `Panne "${panneName}" non trouvée`,
          },
        ];
      }
      if (!engin) {
        return [
          {
            success: false,
            data: data,
            message: `Engin "${enginName}" non trouvé`,
          },
        ];
      }

      // Trouver la saisieHRM correspondante
      const saisieHRM = await prisma.saisiehrm.findFirst({
        where: {
          enginId: engin.id,
          du: saisiehrmDu,
        },
      });

      if (!saisieHRM) {
        return [
          {
            success: false,
            data: data,
            message: `SaisieHRM non trouvée pour l'engin ${enginName} à la date ${saisiehrmDu}`,
          },
        ];
      }

      const saisieHIM = await prisma.saisiehim.upsert({
        where: {
          panneId_saisiehrmId: {
            panneId: panne.id,
            saisiehrmId: saisieHRM.id,
          },
        },
        update: {
          him: him,
          ni: ni,
          obs: obs,
          enginId: engin.id,
          updatedAt: new Date(),
        },
        create: {
          panneId: panne.id,
          him: him,
          ni: ni,
          saisiehrmId: saisieHRM.id,
          obs: obs,
          enginId: engin.id,
        },
      });

      return [
        {
          success: true,
          data: saisieHIM,
          message: `SaisieHIM importée avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des SaisieLubrifiant
  async importSaisieLubrifiant(data) {
    // console.log("Import SaisieLubrifiant - Données:", data);

    try {
      // Conversion des champs
      const lubrifiantName = convertField(data.lubrifiantName, "string");
      const qte = convertField(data.qte, "number");
      const saisiehimId = convertField(data.saisiehimId, "string");
      const typeconsommationlubName = convertField(
        data.typeconsommationlubName,
        "string"
      );
      const obs = convertField(data.obs, "string");

      // Validation des champs requis
      const requiredFields = {
        lubrifiantName: lubrifiantName,
        qte: qte,
        saisiehimId: saisiehimId,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (value === null || value === undefined || value === "") {
          return [
            {
              success: false,
              data: data,
              message: `Erreur: Le champ '${field}' est requis`,
            },
          ];
        }
      }

      const lubrifiant = await prisma.lubrifiant.findUnique({
        where: { name: lubrifiantName },
      });

      if (!lubrifiant) {
        return [
          {
            success: false,
            data: data,
            message: `Lubrifiant "${lubrifiantName}" non trouvé`,
          },
        ];
      }

      let typeConsommationLub = null;
      if (typeconsommationlubName) {
        typeConsommationLub = await prisma.typeconsommationlub.findUnique({
          where: { name: typeconsommationlubName },
        });
      }

      const saisieLubrifiant = await prisma.saisielubrifiant.create({
        data: {
          lubrifiantId: lubrifiant.id,
          qte: qte,
          obs: obs,
          saisiehimId: saisiehimId,
          typeconsommationlubId: typeConsommationLub?.id || null,
        },
      });

      return [
        {
          success: true,
          data: saisieLubrifiant,
          message: `SaisieLubrifiant importée avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Objectifs
  async importObjectifs(data) {
    // console.log("Import Objectifs - Données:", data);

    try {
      // Conversion des champs
      const annee = convertField(data.annee, "int");
      const parcName = convertField(data.parcName, "string");
      const siteName = convertField(data.siteName, "string");
      const dispo = convertField(data.dispo, "number");
      const mtbf = convertField(data.mtbf, "number");
      const tdm = convertField(data.tdm, "number");
      const spe_huile = convertField(data.spe_huile, "number");
      const spe_go = convertField(data.spe_go, "number");
      const spe_graisse = convertField(data.spe_graisse, "number");

      // Validation des champs requis
      const requiredFields = {
        annee: annee,
        parcName: parcName,
        siteName: siteName,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (value === null || value === undefined || value === "") {
          return [
            {
              success: false,
              data: data,
              message: `Erreur: Le champ '${field}' est requis`,
            },
          ];
        }
      }

      const [parc, site] = await Promise.all([
        prisma.parc.findUnique({ where: { name: parcName } }),
        prisma.site.findUnique({ where: { name: siteName } }),
      ]);

      if (!parc) {
        return [
          {
            success: false,
            data: data,
            message: `Parc "${parcName}" non trouvé`,
          },
        ];
      }
      if (!site) {
        return [
          {
            success: false,
            data: data,
            message: `Site "${siteName}" non trouvé`,
          },
        ];
      }

      const objectif = await prisma.objectif.upsert({
        where: {
          annee_parcId_siteId: {
            annee: annee,
            parcId: parc.id,
            siteId: site.id,
          },
        },
        update: {
          dispo: dispo,
          mtbf: mtbf,
          tdm: tdm,
          spe_huile: spe_huile,
          spe_go: spe_go,
          spe_graisse: spe_graisse,
          updatedAt: new Date(),
        },
        create: {
          annee: annee,
          parcId: parc.id,
          siteId: site.id,
          dispo: dispo,
          mtbf: mtbf,
          tdm: tdm,
          spe_huile: spe_huile,
          spe_go: spe_go,
          spe_graisse: spe_graisse,
        },
      });

      return [
        {
          success: true,
          data: objectif,
          message: `Objectif importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Roles
  async importRoles(data) {
    // console.log("Import Roles - Données:", data);

    try {
      const name = convertField(data.name, "string");

      if (!name || name.trim() === "") {
        return [
          {
            success: false,
            data: data,
            message: `Erreur: Le champ 'name' est requis`,
          },
        ];
      }

      const role = await prisma.role.upsert({
        where: { name: name },
        update: {
          name: name,
          updatedAt: new Date(),
        },
        create: {
          name: name,
        },
      });

      return [
        {
          success: true,
          data: role,
          message: `Role ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Import des Users
  async importUsers(data) {
    // console.log("Import Users - Données:", data);

    try {
      // Conversion des champs
      const name = convertField(data.name, "string");
      const email = convertField(data.email, "string");
      const password = convertField(data.password, "string");
      const active = convertField(data.active, "boolean") ?? true;

      // Validation des champs requis
      const requiredFields = {
        name: name,
        email: email,
        password: password,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
          return [
            {
              success: false,
              data: data,
              message: `Erreur: Le champ '${field}' est requis`,
            },
          ];
        }
      }

      const user = await prisma.user.upsert({
        where: { email: email },
        update: {
          name: name,
          password: password, // Note: Devrait être hashé en production
          active: active,
          updatedAt: new Date(),
        },
        create: {
          name: name,
          email: email,
          password: password, // Note: Devrait être hashé en production
          active: active,
        },
      });

      return [
        {
          success: true,
          data: user,
          message: `User ${name} importé avec succès`,
        },
      ];
    } catch (error) {
      return [
        {
          success: false,
          data: data,
          message: `Erreur: ${error.message}`,
        },
      ];
    }
  }

  // Méthodes helpers pour les relations many-to-many (gardées pour référence si besoin)
  async handleLubrifiantParc(parcId, lubrifiantNames) {
    // Implémentation gardée si nécessaire pour d'autres usages
  }

  async handleTypeConsommationParc(parcId, typeConsommationNames) {
    // Implémentation gardée si nécessaire pour d'autres usages
  }
}

module.exports = ImportService;
