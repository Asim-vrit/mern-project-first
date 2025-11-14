const express = require("express");
const {
  getAllProducts,
  getProductById,
  postProduct,
  udpateProduct,
  deleteProduct,
} = require("./handler");
const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", postProduct);
router.put("/products/:id", udpateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
