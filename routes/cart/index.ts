import express from "express";
import { superUserOnly, validateToken } from "../../middleware/auth_middleware";
import { addToCart, getAllCarts, getMyCart } from "./handler";
const router = express.Router();

router.get("/cart", validateToken, superUserOnly, getAllCarts);
router.post("/add-to-cart", validateToken, addToCart);
router.get("/get-my-cart", validateToken, getMyCart);

export { router };
