import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

// روت‌های ناموجود
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `مسیر مورد نظر یافت نشد: ${req.originalUrl}`));
};

interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
}

interface MongoDuplicateKeyError extends Error {
  code: 11000;
  keyValue?: Record<string, unknown>;
}

interface MongooseCastError extends Error {
  name: "CastError";
  value: unknown;
}

type KnownError = ApiError | MongooseValidationError | MongoDuplicateKeyError | MongooseCastError | Error;

// هندلر مرکزی خطا
export const errorHandler = (
  err: KnownError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = err instanceof ApiError ? err.statusCode : 500;
  let message = err.message || "خطای داخلی سرور";

  // خطای duplicate key در mongoose
  if ((err as MongoDuplicateKeyError).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as MongoDuplicateKeyError).keyValue || {})[0];
    message = `مقدار وارد شده برای «${field}» تکراری است.`;
  }

  // خطای اعتبارسنجی mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values((err as MongooseValidationError).errors)
      .map((e) => e.message)
      .join(" | ");
  }

  // خطای CastError (مثلا ObjectId نامعتبر)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `شناسه نامعتبر: ${(err as MongooseCastError).value}`;
  }

  // خطای multer (حجم فایل، تعداد فایل و ...)
  if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.message === "File too large"
        ? "حجم فایل بیشتر از حد مجاز است."
        : `خطا در آپلود فایل: ${err.message}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
