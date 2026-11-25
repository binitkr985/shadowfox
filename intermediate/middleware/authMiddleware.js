import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "./errorMiddleware.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError("Not authorized, token missing", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(createError("Not authorized, user no longer exists", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError("Not authorized, invalid or expired token", 401));
  }
};

export default protect;
