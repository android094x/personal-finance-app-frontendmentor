import { Router } from "express";
import { z } from "zod";

import { CreateCategorySchema, UpdateCategorySchema } from "@finance/shared";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/controllers/categories.controller";
import { authenticateToken } from "@/middleware/auth";
import { validateBody, validateParams } from "@/middleware/validation";

const ParamsSchema = z.object({
  id: z.uuid(),
});

const router = Router();

router.use(authenticateToken);

router.get("/", getAllCategories);

router.post("/", validateBody(CreateCategorySchema), createCategory);

router.patch(
  "/:id",
  validateParams(ParamsSchema),
  validateBody(UpdateCategorySchema),
  updateCategory,
);

router.delete("/:id", validateParams(ParamsSchema), deleteCategory);

export default router;
