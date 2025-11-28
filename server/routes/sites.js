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

// require auth for all routes bellow
router.use(authMiddleware);
// router.use(verifyJWT)

// GET all
router.get("/", checkPermission("sites", ACTION.READ), getSites);

// GET single workout
router.get("/:id", checkPermission("sites", ACTION.READ), getSite);

// POST a new workout
router.post("/", checkPermission("sites", ACTION.CREATE), createSite);

// UPDATE a workout
router.patch("/:id", checkPermission("sites", ACTION.UPDATE), updateSite);

// DELETE a workout
router.delete("/:id", checkPermission("sites", ACTION.DELETE), deleteSite);

module.exports = router;
