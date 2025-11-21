const express = require("express");
const {
  login,
  register,
  staffRegister,
  getMe,
  changePassword,
} = require("./handler");
const {
  validateToken,
  superUserOnly,
} = require("../../middleware/auth_middleware");
const router = express.Router();

router.post("/login", login);
router.post("/staff-register", validateToken, superUserOnly, staffRegister);
router.post("/register", register);
router.get("/me", validateToken, getMe);
router.post("/change-password", validateToken, changePassword);

module.exports = router;
