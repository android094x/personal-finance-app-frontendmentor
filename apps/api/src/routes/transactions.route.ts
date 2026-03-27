import { Router } from "express";
import { z } from "zod";

import {
  CreateTransactionSchema,
  TransactionQuerySchema,
  UpdateTransactionSchema,
} from "@finance/shared";

import {
  createTransaction,
  deleteTransaction,
  getAllUserTransactions,
  getUserTransactionById,
  updateUserTransaction,
} from "@/controllers/transactions.controller";
import { authenticateToken } from "@/middleware/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation";

const ParamsSchema = z.object({
  id: z.uuid(),
});

const router = Router();

router.use(authenticateToken);

router.get("/", validateQuery(TransactionQuerySchema), getAllUserTransactions);

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
