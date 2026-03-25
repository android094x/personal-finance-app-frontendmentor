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
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middleware/validation";

const ParamsSchema = z.object({
  id: z.uuid(),
});

const QuerySchema = z.object({
  page: z.coerce.number().gte(1).default(1),
  limit: z.coerce.number().gte(1).lte(100).default(10),
  sort: z
    .enum(["latest", "oldest", "a-z", "z-a", "highest", "lowest"])
    .default("latest"),
  category: z.string().optional(),
  search: z.string().optional(),
});

export type PaginationQueryParams = z.infer<typeof QuerySchema>;

const router = Router();

router.use(authenticateToken);

router.get("/", validateQuery(QuerySchema), getAllUserTransactions);

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
