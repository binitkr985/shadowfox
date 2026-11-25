import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import {
  addToCartValidation,
  updateCartItemValidation,
  removeCartItemValidation,
} from "../validators/cartValidator.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCartValidation, addToCart);
router.patch("/:productId", updateCartItemValidation, updateCartItem);
router.delete("/:productId", removeCartItemValidation, removeFromCart);
router.delete("/", clearCart);

export default router;
