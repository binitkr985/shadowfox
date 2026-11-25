import { body, param } from "express-validator";
import { validateRequest } from "./authValidator.js";

export const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID format"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than zero"),
  validateRequest,
];

export const updateCartItemValidation = [
  param("productId").isMongoId().withMessage("Invalid product ID format"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than zero"),
  validateRequest,
];

export const removeCartItemValidation = [
  param("productId").isMongoId().withMessage("Invalid product ID format"),
  validateRequest,
];
