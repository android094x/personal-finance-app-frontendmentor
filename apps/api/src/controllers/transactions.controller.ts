import type { Response } from "express";

import type { CreateTransaction, UpdateTransaction } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import type { PaginationQueryParams } from "@/routes/transactions.route";
import * as txsService from "@/services/transactions.service";

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const transaction = await txsService.create(
      userId,
      req.body as CreateTransaction,
    );

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.log(`Create transaction error: ${error}`);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

export const getAllUserTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const query = res.locals.query as PaginationQueryParams;
    const result = await txsService.getAll(userId, query);

    res.status(200).json(result);
  } catch (error) {
    console.log(`Get transactions error: ${error}`);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const getUserTransactionById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const transaction = await txsService.getById(userId, id);

    if (!transaction) {
      res.status(404).json({ error: `Transaction not found ${id}` });
      return;
    }

    res.json({ transaction });
  } catch (error) {
    console.log(`Get transaction error: ${error}`);
    res
      .status(500)
      .json({ error: `Failed to fetch transaction ${req.params.id}` });
  }
};

export const updateUserTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const transaction = await txsService.update(
      userId,
      id,
      req.body as UpdateTransaction,
    );

    if (!transaction) {
      res.status(404).json({ error: `Transaction not found ${id}` });
      return;
    }

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.log(`Update transaction error: ${error}`);
    res
      .status(500)
      .json({ error: `Failed to update transaction ${req.params.id}` });
  }
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const transaction = await txsService.remove(userId, id);

    if (!transaction) {
      res.status(404).json({ error: `Transaction not found ${id}` });
      return;
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log(`Delete transaction error: ${error}`);
    res
      .status(500)
      .json({ error: `Failed to delete transaction ${req.params.id}` });
  }
};
