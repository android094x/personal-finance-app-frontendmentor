import type { Request, Response } from "express";

import * as authService from "@/services/auth.service";
import { AppError } from "@/middleware/errorHandler";

export const register = async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  res.status(201).json({
    data: result,
    message: "User created successfully",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  if (!result) {
    throw new AppError(401, "Invalid credentials");
  }

  res.json({
    data: result,
    message: "Login successful",
  });
};
