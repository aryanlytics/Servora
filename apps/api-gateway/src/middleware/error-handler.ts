import type { Request, Response, NextFunction } from "express";
import { AppError, ApiResponse } from "@servora/shared-utils";

/**
 * Global error handler middleware.
 * Catches all errors and returns a standardized response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      ApiResponse.error(err.message)
    );
    return;
  }

  // Unknown errors
  console.error("Unhandled error:", err);
  res.status(500).json(
    ApiResponse.error("Internal server error")
  );
}
