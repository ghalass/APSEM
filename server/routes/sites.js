const express = require("express");

// controller functions
const {
  createSite,
  getSites,
  getSite,
  deleteSite,
  updateSite,
} = require("../controllers/siteController");

const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");
// const allowedRoles = require("../middleware/allowedRoles");
// const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router();
const resource = "sites";

// require auth for all routes bellow
// router.use(authMiddleware);
// router.use(verifyJWT)

// GET all
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getSites
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getSite
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createSite
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateSite
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteSite
);

module.exports = router;
