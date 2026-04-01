import type { Response } from "express";

import type {
  CreateTransaction,
  TransactionQuery,
  UpdateTransaction,
} from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as txsService from "@/services/transactions.service";
import { AppError } from "@/middleware/errorHandler";

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const transaction = await txsService.create(
    userId,
    req.body as CreateTransaction,
  );

  res.status(201).json({
    data: transaction,
    message: "Transaction created successfully",
  });
};

export const getAllUserTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const query = res.locals.query as TransactionQuery;
  const result = await txsService.getAll(userId, query);

  res.json({
    data: result.transactions,
    meta: { pagination: result.pagination },
  });
};

export const getUserTransactionById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const transaction = await txsService.getById(userId, id);

  if (!transaction) {
    throw new AppError(404, `Transaction not found ${id}`);
  }

  res.json({ data: transaction });
};

export const updateUserTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const transaction = await txsService.update(
    userId,
    id,
    req.body as UpdateTransaction,
  );

  if (!transaction) {
    throw new AppError(404, `Transaction not found ${id}`);
  }

  res.json({
    data: transaction,
    message: "Transaction updated successfully",
  });
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const { id } = req.params as { id: string };
  const transaction = await txsService.remove(userId, id);

  if (!transaction) {
    throw new AppError(404, `Transaction not found ${id}`);
  }

  res.json({ data: null, message: "Transaction deleted successfully" });
};
