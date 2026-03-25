import { verifyToken, type JWTPayloadWithUser } from "@/utils/jwt";
import type { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayloadWithUser;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader ? authHeader.split(" ")[1] : "";

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = await verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden" });
  }
};
