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
const { userSchema } = require("../../utils/schema");
const {
  validationMiddleware,
} = require("../../middleware/validation_middleware");

const router = express.Router();

router.get("/users", validateToken, superUserOnly, getAllUsers);
router.get("/users/:id", validateToken, superUserOnly, getUserById);
router.post(
  "/users",
  validateToken,
  superUserOnly,
  validationMiddleware(userSchema),
  postUser
);
router.put("/users/:id", validateToken, superUserOnly, udpateUser);
router.delete("/users/:id", validateToken, superUserOnly, deleteUser);

module.exports = router;
