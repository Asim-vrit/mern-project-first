const express = require("express");
const {
  getAllUsers,
  getUserById,
  postUser,
  udpateUser,
  deleteUser,
} = require("./handler");
const {
  validateToken,
  superUserOnly,
} = require("../../middleware/auth_middleware");
const router = express.Router();

router.get("/users", validateToken, superUserOnly, getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", postUser);
router.put("/users/:id", udpateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
