import type { Request, Response } from "express";

import * as authService from "@/services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      ...result,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    if (!result) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};
