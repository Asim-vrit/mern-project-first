import express from "express";
import {
  getAllProducts,
  getProductById,
  postProduct,
  udpateProduct,
  deleteProduct,
} from "./handler";
import { validateToken, staffOnly } from "../../middleware/auth_middleware";
import { productSchema } from "../../utils/schema";
import { validationMiddleware } from "../../middleware/validation_middleware";
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

export { router };
