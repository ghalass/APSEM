const express = require("express");

// controller functions
const {
  createTypepanne,
  getTypepannes,
  getTypepanne,
  deleteTypepanne,
  updateTypepanne,
  addParcToTypepanne,
  deleteAffectationTypepanne,
  getAllTypepannesByParcId,
} = require("../controllers/typepanneController");

const authMiddleware = require("../middleware/authMiddleware");
// const allowedRoles = require("../middleware/allowedRoles");
const { ACTION } = require("../helpers/constantes");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();
const resource = "typepannes";

// require auth for all routes bellow
// router.use(authMiddleware);

router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getTypepannes
);

// GET single workout
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getTypepanne
);

router.get(
  "/byparcid/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getAllTypepannesByParcId
);

// POST a new workout
router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createTypepanne
);

// UPDATE a workout
router.patch(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateTypepanne
);

// DELETE a workout
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteTypepanne
);

router.post(
  "/affectparctotypepanne",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  addParcToTypepanne
);

router.delete(
  "/affectparctotypepanne/delete",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteAffectationTypepanne
);

module.exports = router;
