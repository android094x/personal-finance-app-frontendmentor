import type { Response } from "express";

import type { CreatePot, UpdatePot } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as potsService from "@/services/pots.service";
import { AppError } from "@/middleware/errorHandler";

export const getAllPots = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const pots = await potsService.getAll(userId);

  res.json({ data: pots });
};

export const getPotById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const pot = await potsService.getById(userId, id);

  if (!pot) {
    throw new AppError(404, `Pot not found ${id}`);
  }

  res.json({ data: pot });
};

export const createPot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const pot = await potsService.create(userId, req.body as CreatePot);

  res.status(201).json({
    data: pot,
    message: "Pot created successfully",
  });
};

export const updatePot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const pot = await potsService.update(userId, id, req.body as UpdatePot);

  if (!pot) {
    throw new AppError(404, `Pot not found ${id}`);
  }

  res.json({
    data: pot,
    message: "Pot updated successfully",
  });
};

export const deletePot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const pot = await potsService.remove(userId, id);

  if (!pot) {
    throw new AppError(404, `Pot not found ${id}`);
  }

  res.json({ data: null, message: "Pot deleted successfully" });
};

export const depositToPot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const { amount } = req.body;
  const pot = await potsService.deposit(userId, id, amount);

  if (!pot) {
    throw new AppError(404, `Pot not found ${id}`);
  }

  res.json({
    data: pot,
    message: "Deposit successful",
  });
};

export const withdrawFromPot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const { amount } = req.body;
  const pot = await potsService.withdraw(userId, id, amount);

  if (!pot) {
    throw new AppError(404, `Pot not found ${id}`);
  }

  res.json({
    data: pot,
    message: "Withdrawal successful",
  });
};
