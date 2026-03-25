import { Router } from "express";
import { z } from "zod";

import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from "@finance/shared";

import {
  createTransaction,
  deleteTransaction,
  getAllUserTransactions,
  getUserTransactionById,
  updateUserTransaction,
} from "@/controllers/txsController";
import { authenticateToken } from "@/middleware/auth";
import { validateBody, validateParams } from "@/middleware/validation";

const ParamsSchema = z.object({
  id: z.uuid(),
});

const router = Router();

router.use(authenticateToken);

router.get("/", getAllUserTransactions);

router.get("/:id", validateParams(ParamsSchema), getUserTransactionById);

router.post("/", validateBody(CreateTransactionSchema), createTransaction);

router.patch(
  "/:id",
  validateParams(ParamsSchema),
  validateBody(UpdateTransactionSchema),
  updateUserTransaction,
);

router.delete("/:id", validateParams(ParamsSchema), deleteTransaction);

export default router;
