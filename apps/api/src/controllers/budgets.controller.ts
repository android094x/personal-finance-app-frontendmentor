import type { Response } from "express";

import type { CreateBudget, UpdateBudget } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as budgetsService from "@/services/budgets.service";
import { AppError } from "@/middleware/errorHandler";

export const getAllBudgets = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const budgets = await budgetsService.getAll(userId);

  res.json({ data: budgets });
};

export const getBudgetById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const budget = await budgetsService.getById(userId, id);

  if (!budget) {
    throw new AppError(404, `Budget not found ${id}`);
  }

  res.json({ data: budget });
};

export const createBudget = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const budget = await budgetsService.create(
    userId,
    req.body as CreateBudget,
  );

  res.status(201).json({
    data: budget,
    message: "Budget created successfully",
  });
};

export const updateBudget = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const budget = await budgetsService.update(
    userId,
    id,
    req.body as UpdateBudget,
  );

  if (!budget) {
    throw new AppError(404, `Budget not found ${id}`);
  }

  res.json({
    data: budget,
    message: "Budget updated successfully",
  });
};

export const deleteBudget = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const budget = await budgetsService.remove(userId, id);

  if (!budget) {
    throw new AppError(404, `Budget not found ${id}`);
  }

  res.json({ data: null, message: "Budget deleted successfully" });
};
