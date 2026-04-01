import { verifyToken, type JWTPayloadWithUser } from "@/utils/jwt";
import { AppError } from "@/middleware/errorHandler";
import type { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayloadWithUser;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : "";

  if (!token) {
    throw new AppError(401, "Unauthorized");
  }

  try {
    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError(403, "Forbidden");
  }
};
