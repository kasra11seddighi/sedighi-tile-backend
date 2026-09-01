import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.model";
import { env } from "../config/env";

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req, _res, next) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "دسترسی غیرمجاز. توکن ارسال نشده است.");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "کاربر مربوط به این توکن یافت نشد.");
    }
    req.user = user;
    next();
  } catch {
    throw new ApiError(401, "توکن نامعتبر یا منقضی شده است.");
  }
});
