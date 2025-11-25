const express = require("express");

// controller functions
const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const {
  assignRoleToUser,
  assignPermissionRole,
} = require("../controllers/assignController");

const router = express.Router();

// assign role to user
router.post(
  "/role-to-user",
  authMiddleware,
  checkPermission("roles", "ASSIGN"),
  assignRoleToUser
);

// Assign permission to role
router.post(
  "/permission-to-role",
  authMiddleware,
  checkPermission("permissions", "ASSIGN"),
  assignPermissionRole
);

module.exports = router;
