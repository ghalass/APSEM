const express = require("express");

// controller functions
const {
  getRoles,
  updateRole,
  deleteRole,
  createRole,
  getRole,
} = require("../controllers/roleController");

const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");

const router = express.Router();
const resource = "roles";

// GET ALL ROLES
router.get(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getRoles
);

// GET ROLE BY ID
router.get(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getRole
);

router.post(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.CREATE),
  createRole
);

// UPDATE AN ROLE
router.patch(
  "/",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateRole
);

// DELETE AN ROLE
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteRole
);

module.exports = router;
