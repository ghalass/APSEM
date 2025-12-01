const { body, validationResult } = require("express-validator");

// Validation pour la création d'anomalie
const validateAnomalie = [
  body("numeroBacklog")
    .notEmpty()
    .withMessage("Le numéro de backlog est requis")
    .isString()
    .withMessage("Le numéro de backlog doit être une chaîne de caractères"),

  body("dateDetection")
    .notEmpty()
    .withMessage("La date de détection est requise")
    .isISO8601()
    .withMessage("La date de détection doit être une date valide (format ISO)"),

  body("description")
    .notEmpty()
    .withMessage("La description est requise")
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),

  body("source")
    .notEmpty()
    .withMessage("La source est requise")
    .isIn(["VS", "VJ", "INSPECTION", "AUTRE"])
    .withMessage(
      "Source invalide. Valeurs acceptées: VS, VJ, INSPECTION, AUTRE"
    ),

  body("priorite")
    .notEmpty()
    .withMessage("La priorité est requise")
    .isIn(["ELEVEE", "MOYENNE", "FAIBLE"])
    .withMessage(
      "Priorité invalide. Valeurs acceptées: ELEVEE, MOYENNE, FAIBLE"
    ),

  body("statut")
    .notEmpty()
    .withMessage("Le statut est requis")
    .isIn([
      "ATTENTE_PDR",
      "PDR_PRET",
      "NON_PROGRAMMEE",
      "PROGRAMMEE",
      "EXECUTE",
    ])
    .withMessage("Statut invalide"),

  body("enginId")
    .notEmpty()
    .withMessage("L'engin est requis")
    .isString()
    .withMessage("L'ID de l'engin doit être une chaîne de caractères"),

  body("siteId")
    .notEmpty()
    .withMessage("Le site est requis")
    .isString()
    .withMessage("L'ID du site doit être une chaîne de caractères"),

  // body("besoinPDR")
  //   .optional()
  //   .isBoolean()
  //   .withMessage("Le besoin en PDR doit être un booléen"),

  // body("quantite")
  //   .optional()
  //   .isInt({ min: 0 })
  //   .withMessage("La quantité doit être un nombre entier positif"),

  // body("dateExecution")
  //   .optional()
  //   .isISO8601()
  //   .withMessage("La date d'exécution doit être une date valide (format ISO)"),

  // // Middleware pour vérifier les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Erreur de validation",
        details: errors.array(),
      });
    }
    next();
  },
];

// Validation pour la mise à jour d'anomalie (tous les champs optionnels)
const validateUpdateAnomalie = [
  body("numeroBacklog")
    .optional()
    .isString()
    .withMessage("Le numéro de backlog doit être une chaîne de caractères"),

  body("dateDetection")
    .optional()
    .isISO8601()
    .withMessage("La date de détection doit être une date valide (format ISO)"),

  body("description")
    .optional()
    .isString()
    .withMessage("La description doit être une chaîne de caractères"),

  body("source")
    .optional()
    .isIn(["VS", "VJ", "INSPECTION", "AUTRE"])
    .withMessage("Source invalide. Valeurs acceptées: VS, VJ, AUTRE"),

  body("priorite")
    .optional()
    .isIn(["ELEVEE", "MOYENNE", "FAIBLE"])
    .withMessage(
      "Priorité invalide. Valeurs acceptées: ELEVEE, MOYENNE, FAIBLE"
    ),

  body("statut")
    .optional()
    .isIn([
      "ATTENTE_PDR",
      "PDR_PRET",
      "NON_PROGRAMMEE",
      "PROGRAMMEE",
      "EXECUTE",
    ])
    .withMessage("Statut invalide"),

  body("enginId")
    .optional()
    .isString()
    .withMessage("L'ID de l'engin doit être une chaîne de caractères"),

  body("siteId")
    .optional()
    .isString()
    .withMessage("L'ID du site doit être une chaîne de caractères"),

  // body("besoinPDR")
  //   .optional()
  //   .isBoolean()
  //   .withMessage("Le besoin en PDR doit être un booléen"),

  // body("quantite")
  //   .optional()
  //   .isInt({ min: 0 })
  //   .withMessage("La quantité doit être un nombre entier positif"),

  // body("dateExecution")
  //   .optional()
  //   .isISO8601()
  //   .withMessage("La date d'exécution doit être une date valide (format ISO)"),

  // Middleware pour vérifier les erreurs
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Erreur de validation",
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateAnomalie,
  validateUpdateAnomalie,
};
