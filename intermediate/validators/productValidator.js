import { body, param } from "express-validator";
import { validateRequest } from "./authValidator.js";

export const validateProductId = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validateRequest,
];

export const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imageUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  validateRequest,
];

export const updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("imageUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  validateRequest,
];
