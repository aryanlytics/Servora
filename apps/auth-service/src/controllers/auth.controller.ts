import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "../models/auth-user.model";
import {
  ApiResponse,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  registerSchema,
  loginSchema,
} from "@servora/shared-utils";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "default-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "default-refresh-secret";
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

function generateTokens(payload: { userId: string; email: string; role: string }) {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES as any });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES as any });
  return { accessToken, refreshToken };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await AuthUser.findOne({ email: validated.email });
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const user = await AuthUser.create({
      email: validated.email,
      password: validated.password,
      role: validated.role,
    });

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json(
      ApiResponse.success(
        {
          user: user.toJSON(),
          ...tokens,
        },
        "Registration successful"
      )
    );
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await AuthUser.findOne({ email: validated.email });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await user.comparePassword(validated.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(
      ApiResponse.success(
        {
          user: user.toJSON(),
          ...tokens,
        },
        "Login successful"
      )
    );
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    const user = await AuthUser.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(ApiResponse.success(tokens, "Token refreshed"));
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (userId) {
      await AuthUser.findByIdAndUpdate(userId, { refreshToken: null });
    }
    res.json(ApiResponse.success(null, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
}
