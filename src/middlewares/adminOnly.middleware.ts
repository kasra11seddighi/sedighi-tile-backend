import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const adminOnly = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new ApiError(403, "فقط ادمین به این بخش دسترسی دارد.");
};
