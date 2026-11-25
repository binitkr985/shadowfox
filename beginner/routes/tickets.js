import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import Ticket from "../models/Ticket.js";

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ticket ID format" });
  }
  next();
};

const createTicketValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .isIn(["technical", "billing", "account", "general"])
    .withMessage("Category must be technical, billing, account, or general"),
];

const updateStatusValidation = [
  body("status")
    .isIn(["open", "in_progress", "resolved"])
    .withMessage("Status must be open, in_progress, or resolved"),
];

router.post("/", createTicketValidation, validateRequest, async (req, res) => {
  try {
    const { name, email, subject, description, category } = req.body;

    const ticket = await Ticket.create({
      name,
      email,
      subject,
      description,
      category,
      status: "open",
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating ticket" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching tickets" });
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching ticket" });
  }
});

router.patch(
  "/:id",
  validateObjectId,
  updateStatusValidation,
  validateRequest,
  async (req, res) => {
    try {
      const { status } = req.body;

      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Server error while updating ticket" });
    }
  }
);

export default router;

