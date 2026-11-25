import { createError } from "./errorMiddleware.js";

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return next(createError("Access denied: admin privileges required", 403));
};

export default adminOnly;
