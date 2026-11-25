import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  validateProductId,
  createProductValidation,
  updateProductValidation,
} from "../validators/productValidator.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", validateProductId, getProductById);
router.post("/", protect, adminOnly, createProductValidation, createProduct);
router.patch("/:id", protect, adminOnly, updateProductValidation, updateProduct);
router.delete("/:id", protect, adminOnly, validateProductId, deleteProduct);

export default router;
