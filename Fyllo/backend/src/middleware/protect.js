import jwt from "jsonwebtoken";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { ApiError } from "../lib/apiError.js";
import User from "../features/users/authModel.js";

export const protect = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) throw new ApiError("Not authorized", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError("User not found", 404);

  req.user = { id: user._id, role: user.role };
  next();
});

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) throw new ApiError("Forbidden", 403);
    next();
  };
