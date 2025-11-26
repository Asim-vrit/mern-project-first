const express = require("express");
const { getAllCarts, addToCart, getMyCart } = require("./handler");
const {
  validateToken,
  staffOnly,
  superUserOnly,
} = require("../../middleware/auth_middleware");
const router = express.Router();

router.get("/cart", validateToken, superUserOnly, getAllCarts);
router.post("/add-to-cart", validateToken, addToCart);
router.get("/get-my-cart", validateToken, getMyCart);

module.exports = router;
