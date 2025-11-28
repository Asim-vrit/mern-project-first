import express from "express";
import {
  getAllUsers,
  getUserById,
  postUser,
  udpateUser,
  deleteUser,
} from "./handler";
import { validateToken, superUserOnly } from "../../middleware/auth_middleware";
import { userSchema } from "../../utils/schema";
import { validationMiddleware } from "../../middleware/validation_middleware";

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

export { router };
