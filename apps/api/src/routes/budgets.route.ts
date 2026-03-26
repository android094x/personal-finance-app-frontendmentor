import { Router } from "express";
import { z } from "zod";

import { CreateBudgetSchema, UpdateBudgetSchema } from "@finance/shared";

import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
} from "@/controllers/budgets.controller";
import { authenticateToken } from "@/middleware/auth";
import { validateBody, validateParams } from "@/middleware/validation";

const ParamsSchema = z.object({
  id: z.uuid(),
});

const router = Router();

router.use(authenticateToken);

router.get("/", getAllBudgets);

router.get("/:id", validateParams(ParamsSchema), getBudgetById);

router.post("/", validateBody(CreateBudgetSchema), createBudget);

router.patch(
  "/:id",
  validateParams(ParamsSchema),
  validateBody(UpdateBudgetSchema),
  updateBudget,
);

router.delete("/:id", validateParams(ParamsSchema), deleteBudget);

export default router;
