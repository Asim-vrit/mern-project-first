const express = require("express");
const {
  getAllProducts,
  getProductById,
  postProduct,
  udpateProduct,
  deleteProduct,
} = require("./handler");
const { validateToken } = require("../../middleware/auth_middleware");
const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", validateToken, postProduct);
router.put("/products/:id", validateToken, udpateProduct);
router.delete("/products/:id", validateToken, deleteProduct);

module.exports = router;
