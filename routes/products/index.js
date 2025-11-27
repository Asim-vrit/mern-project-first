const express = require("express");
const {
  getAllProducts,
  getProductById,
  postProduct,
  udpateProduct,
  deleteProduct,
} = require("./handler");
const {
  validateToken,
  staffOnly,
} = require("../../middleware/auth_middleware");
const { productSchema } = require("../../utils/schema");
const {
  validationMiddleware,
} = require("../../middleware/validation_middleware");
const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post(
  "/products",
  validateToken,
  staffOnly,
  validationMiddleware(productSchema),
  postProduct
);
router.put("/products/:id", validateToken, staffOnly, udpateProduct);
router.delete("/products/:id", validateToken, staffOnly, deleteProduct);

module.exports = router;
