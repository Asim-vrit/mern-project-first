import express from "express";
import { staffOnly, validateToken } from "../../middleware/auth_middleware";
import { validationMiddleware } from "../../middleware/validation_middleware";
import { productSchema } from "../../utils/schema";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  postProduct,
  udpateProduct,
} from "./handler";
import { upload } from "../../uploads";
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
router.put(
  "/products/:id",
  validateToken,
  staffOnly,
  upload.single("image"),
  udpateProduct
);
router.delete("/products/:id", validateToken, staffOnly, deleteProduct);

export { router };
