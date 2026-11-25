import express from "express";
import { body, param } from "express-validator";
import {
  placeOrder,
  getMyOrders,
  getOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { ALLOWED_ORDER_STATUSES } from "../services/orderService.js";
import { validateRequest } from "../validators/authValidator.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

const validateOrderId = [
  param("id").isMongoId().withMessage("Invalid order ID format"),
  validateRequest,
];

const validateOrderStatus = [
  param("id").isMongoId().withMessage("Invalid order ID format"),
  body("status")
    .notEmpty()
    .withMessage("Order status is required")
    .bail()
    .isIn(ALLOWED_ORDER_STATUSES)
    .withMessage(
      `Status must be one of: ${ALLOWED_ORDER_STATUSES.join(", ")}`
    ),
  validateRequest,
];

router.post("/orders", protect, placeOrder);
router.get("/orders", protect, getMyOrders);
router.get("/orders/:id", protect, validateOrderId, getOrder);

router.get("/admin/orders", protect, adminOnly, getAdminOrders);
router.patch(
  "/admin/orders/:id/status",
  protect,
  adminOnly,
  validateOrderStatus,
  updateOrderStatus
);

export default router;
