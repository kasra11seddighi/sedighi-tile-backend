import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

type Target = "body" | "query" | "params";

// یک میان‌افزار عمومی برای اعتبارسنجی ورودی با zod.
// در صورت خطا، همان فرمت خطای پروژه (success:false + message) را برمی‌گرداند
// تا errorHandler مرکزی همچنان مسئول پاسخ‌دهی خطا باشد.
export const validate =
  (schema: ZodSchema, target: Target = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);
      (req as unknown as Record<Target, unknown>)[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | ");
        return next(new ApiError(400, message || "ورودی نامعتبر است."));
      }
      next(error);
    }
  };
