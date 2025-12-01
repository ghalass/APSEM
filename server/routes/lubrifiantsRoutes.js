const express = require("express");

// controller functions
const {
  createLubrifiant,
  getLubrifiants,
  deleteLubrifiant,
  updateLubrifiant,
  addParcToLubrifiant,
  deleteAffectationLubrifiant,
  getAllLubrifiantsByParcId,
} = require("../controllers/lubrifiantController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");
// const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router();
const resource = "lubrifiants";

// require auth for all routes bellow
// router.use(authMiddleware);
// router.use(verifyJWT)

// GET all
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getLubrifiants
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getLubrifiants
);

// GET lubrifiant by parcId
router.get(
  "/byparcid/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getAllLubrifiantsByParcId
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createLubrifiant
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateLubrifiant
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteLubrifiant
);

router.post(
  "/affectparctolubrifiant",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  addParcToLubrifiant
);
router.delete(
  "/affectparctolubrifiant/delete",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  deleteAffectationLubrifiant
);

module.exports = router;
