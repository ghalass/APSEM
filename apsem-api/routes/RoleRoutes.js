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

const router = express.Router();

// GET ALL ROLES
router.get("/", authMiddleware, checkPermission("roles", "READ"), getRoles);

// GET ROLE BY ID
router.get("/:id", authMiddleware, checkPermission("roles", "READ"), getRole);

router.post(
  "/",
  authMiddleware,
  checkPermission("roles", "CREATE"),
  createRole
);

// UPDATE AN ROLE
router.patch(
  "/",
  authMiddleware,
  checkPermission("roles", "UPDATE"),
  updateRole
);

// DELETE AN ROLE
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("roles", "DELETE"),
  deleteRole
);

module.exports = router;
