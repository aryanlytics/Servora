import type { IApiResponse } from "@servora/shared-types";

/**
 * Standardized API response builder.
 * Ensures all services return responses in the same shape.
 */
export class ApiResponse {
  static success<T>(data: T, message?: string): IApiResponse<T> {
    return {
      success: true,
      data,
      message: message ?? "Success",
    };
  }

  static paginated<T>(
    data: T,
    meta: { page: number; limit: number; total: number }
  ): IApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    };
  }

  static error(message: string, error?: string): IApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }
}
