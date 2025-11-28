const express = require("express");

// controller functions
const {
  createEngin,
  getEngins,
  getEngin,
  deleteEngin,
  updateEngin,
  getEnginByParcId,
  getEnginsByParcIdSiteId,
} = require("../controllers/enginController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");

const router = express.Router();
const resource = "engins";

// require auth for all routes bellow
// router.use(authMiddleware);

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getEngins
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getEngin
);

// GET single workout
router.get(
  "/byparcid/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getEnginByParcId
);

router.get(
  "/parc/:parcId/site/:siteId",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getEnginsByParcIdSiteId
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createEngin
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateEngin
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteEngin
);

module.exports = router;
