const express = require("express");
const {
  getAllUsers,
  getUserById,
  postUser,
  udpateUser,
  deleteUser,
} = require("./handler");
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", postUser);
router.put("/users/:id", udpateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
