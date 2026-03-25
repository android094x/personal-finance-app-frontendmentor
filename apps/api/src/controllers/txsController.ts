import type { Response } from "express";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

import type { CreateTransaction, UpdateTransaction } from "@finance/shared";

import db from "@/db";
import { transactions } from "@/db/schema";
import type { AuthenticatedRequest } from "@/middleware/auth";
import type { PaginationQueryParams } from "@/routes/txsRoutes";

const ORDER_BY = {
  latest: desc(transactions.date),
  oldest: asc(transactions.date),
  "a-z": asc(transactions.name),
  "z-a": desc(transactions.name),
  highest: desc(transactions.amount),
  lowest: asc(transactions.amount),
} as const;

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const {
      name,
      categoryId,
      amount,
      date,
      recurring,
      avatar = null,
    } = req.body as CreateTransaction;
    const userId = req.user!.id;

    const [createdTx] = await db
      .insert(transactions)
      .values({
        userId,
        categoryId,
        name,
        amount,
        date,
        avatar,
        recurring,
      })
      .returning();

    res.status(201).json({
      message: "Transactions created successfully",
      transaction: createdTx,
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
    const { page, limit, sort, category, search } = res.locals
      .query as PaginationQueryParams;

    const userId = req.user!.id;

    const offset = (page - 1) * limit;

    const conditions = [eq(transactions.userId, userId)];
    if (search) {
      conditions.push(ilike(transactions.name, `%${search}%`));
    }

    if (category) {
      conditions.push(eq(transactions.categoryId, category));
    }

    const [{ total }] = await db
      .select({ total: count() })
      .from(transactions)
      .where(and(...conditions));

    const totalPages = Math.ceil(total / limit);

    const userTransactions = await db.query.transactions.findMany({
      where: and(...conditions),
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      limit,
      offset,
      orderBy: ORDER_BY[sort],
    });

    res.status(200).json({
      transactions: userTransactions,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages,
      },
    });
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
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const transaction = await db.query.transactions.findFirst({
      where: and(eq(transactions.id, id), eq(transactions.userId, userId)),
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!transaction) {
      res.status(404).json({ error: `Transaction not found ${req.params.id}` });
      return;
    }

    res.json({
      transaction,
    });
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
    const { id } = req.params as { id: string };
    const updates = req.body as UpdateTransaction;
    const userId = req.user!.id;

    const [updatedTx] = await db
      .update(transactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();

    if (!updatedTx) {
      res.status(404).json({ error: `Transaction not found ${req.params.id}` });
      return;
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTx,
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
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const [deletedTx] = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();

    if (!deletedTx) {
      res.status(404).json({ error: `Transaction not found ${req.params.id}` });
      return;
    }

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.log(`Delete transaction error: ${error}`);
    res
      .status(500)
      .json({ error: `Failed to delete transaction ${req.params.id}` });
  }
};
