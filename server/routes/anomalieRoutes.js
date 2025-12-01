const express = require("express");
const router = express.Router();
const {
  createAnomalie,
  getAnomalies,
  getAnomalieById,
  updateAnomalie,
  deleteAnomalie,
  getAnomalieStats,
} = require("../controllers/anomalieController");

const {
  getHistoriqueByAnomalie,
  createHistoriqueEntry,
} = require("../controllers/historiqueAnomalieController");

const {
  validateAnomalie,
  validateUpdateAnomalie,
} = require("../middleware/validations/anomalieValidator");
const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");

const resource = "anomalies";

// Routes pour les anomalies
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getAnomalies
);
router.get(
  "/stats",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getAnomalieStats
);
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getAnomalieById
);
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  validateAnomalie,
  createAnomalie
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  validateUpdateAnomalie,
  updateAnomalie
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteAnomalie
);

// Routes pour l'historique des anomalies
router.get(
  "/:anomalieId/historique",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getHistoriqueByAnomalie
);
router.post(
  "/historique",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createHistoriqueEntry
);

module.exports = router;
