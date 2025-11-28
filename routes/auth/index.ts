import express from "express";
import {
  login,
  register,
  staffRegister,
  getMe,
  changePassword,
} from "./handler";
import { validateToken, superUserOnly } from "../../middleware/auth_middleware";

const router = express.Router();

router.post("/login", login);
router.post("/staff-register", validateToken, superUserOnly, staffRegister);
router.post("/register", register);
router.get("/me", validateToken, getMe);
router.post("/change-password", validateToken, changePassword);

export { router };
