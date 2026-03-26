import type { Response } from "express";

import type { CreateBudget, UpdateBudget } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as budgetsService from "@/services/budgets.service";

export const getAllBudgets = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const budgets = await budgetsService.getAll(userId);

    res.json({ budgets });
  } catch (error) {
    console.log(`Get budgets error: ${error}`);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};

export const getBudgetById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const budget = await budgetsService.getById(userId, id);

    if (!budget) {
      res.status(404).json({ error: `Budget not found ${id}` });
      return;
    }

    res.json({ budget });
  } catch (error) {
    console.log(`Get budget error: ${error}`);
    res.status(500).json({ error: `Failed to fetch budget ${req.params.id}` });
  }
};

export const createBudget = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const budget = await budgetsService.create(
      userId,
      req.body as CreateBudget,
    );

    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    console.log(`Create budget error: ${error}`);
    res.status(500).json({ error: "Failed to create budget" });
  }
};

export const updateBudget = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const budget = await budgetsService.update(
      userId,
      id,
      req.body as UpdateBudget,
    );

    if (!budget) {
      res.status(404).json({ error: `Budget not found ${id}` });
      return;
    }

    res.json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.log(`Update budget error: ${error}`);
    res.status(500).json({ error: `Failed to update budget ${req.params.id}` });
  }
};

export const deleteBudget = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const budget = await budgetsService.remove(userId, id);

    if (!budget) {
      res.status(404).json({ error: `Budget not found ${id}` });
      return;
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.log(`Delete budget error: ${error}`);
    res.status(500).json({ error: `Failed to delete budget ${req.params.id}` });
  }
};
