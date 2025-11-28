const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  // getByEmail,
  changePassword,
  getUsers,
  updateUser,
  refresh,
  deleteUser,
  logoutUser,
  checkToken,
  createSuperAdmin,
} = require("../controllers/userController");

// const allowedRoles = require("../middleware/allowedRoles");
const authMiddleware = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/checkPermission");
const { ACTION } = require("../helpers/constantes");

const resource = "users";

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup
router.post("/signup", signupUser);

// logout route
router.post("/logout", logoutUser);

// CREATE A DEFAULT SUPER_ADMIN
router.get("/create_super_admin", createSuperAdmin);

// refresh route
// router.post("/refresh", refresh);

// checktoken route
router.get("/checktoken", checkToken);

// get user route
// router.post("/getByEmail", authMiddleware, getByEmail);

// get user route
router.post("/changePassword", authMiddleware, changePassword);

// GET ALL USERS
router.get(
  "/users",
  authMiddleware,
  checkPermission(resource, ACTION.READ),
  getUsers
);

// UPDATE AN USER
router.patch(
  "/updateUser",
  authMiddleware,
  checkPermission(resource, ACTION.UPDATE),
  updateUser
);

// DELETE AN USER
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(resource, ACTION.DELETE),
  deleteUser
);

module.exports = router;
