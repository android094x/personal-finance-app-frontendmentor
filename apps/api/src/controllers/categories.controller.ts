import type { Response } from "express";

import type { CreateCategory, UpdateCategory } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as categoriesService from "@/services/categories.service";
import { AppError } from "@/middleware/errorHandler";

export const getAllCategories = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const categories = await categoriesService.getAll(userId);

  res.json({ data: categories });
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const category = await categoriesService.create(
    userId,
    req.body as CreateCategory,
  );

  res.status(201).json({
    data: category,
    message: "Category created successfully",
  });
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const category = await categoriesService.update(
    userId,
    id,
    req.body as UpdateCategory,
  );

  if (!category) {
    throw new AppError(404, `Category not found ${id}`);
  }

  res.json({
    data: category,
    message: "Category updated successfully",
  });
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const category = await categoriesService.remove(userId, id);

  if (!category) {
    throw new AppError(404, `Category not found ${id}`);
  }

  res.json({ data: null, message: "Category deleted successfully" });
};
