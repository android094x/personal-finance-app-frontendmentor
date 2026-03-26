import type { Response } from "express";

import type { CreateCategory, UpdateCategory } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as categoriesService from "@/services/categories.service";

export const getAllCategories = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const categories = await categoriesService.getAll(userId);

    res.json({ categories });
  } catch (error) {
    console.log(`Get categories error: ${error}`);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const category = await categoriesService.create(
      userId,
      req.body as CreateCategory,
    );

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(`Create category error: ${error}`);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const category = await categoriesService.update(
      userId,
      id,
      req.body as UpdateCategory,
    );

    if (!category) {
      res.status(404).json({ error: `Category not found ${id}` });
      return;
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(`Update category error: ${error}`);
    res.status(500).json({ error: `Failed to update category ${req.params.id}` });
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const category = await categoriesService.remove(userId, id);

    if (!category) {
      res.status(404).json({ error: `Category not found ${id}` });
      return;
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    // TODO: catch Postgres error 23503 (FK violation) and return 409 "Category is in use"
    console.log(`Delete category error: ${error}`);
    res.status(500).json({ error: `Failed to delete category ${req.params.id}` });
  }
};
