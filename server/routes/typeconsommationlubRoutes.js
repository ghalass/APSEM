const express = require("express");

// controller functions
const {
  createTypeconsommationlub,
  getTypeconsommationlub,
  getTypeconsommationlubs,
  deleteTypeconsommationlub,
  updateTypeconsommationlub,
  addParcToCodeTypeconsommationlub,
  deleteAffectationCodeToParc,
  getAllTypeconsommationlubsByParcId,
} = require("../controllers/typeconsommationlubController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

// require auth for all routes bellow
// router.use(authMiddleware);
const resource = "typeconsommation_lubs";

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getTypeconsommationlubs
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getTypeconsommationlub
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createTypeconsommationlub
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateTypeconsommationlub
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteTypeconsommationlub
);

router.post(
  "/affectparctocode",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  addParcToCodeTypeconsommationlub
);
router.delete(
  "/affectparctocode/delete",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteAffectationCodeToParc
);
router.get(
  "/affectparctocode/byparcid/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getAllTypeconsommationlubsByParcId
);

module.exports = router;
