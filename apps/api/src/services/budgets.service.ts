import { and, eq } from "drizzle-orm";

import type { CreateBudget, UpdateBudget } from "@finance/shared";

import db from "@/db";
import { budgets } from "@/db/schema";

// TODO: getAll and getById should compute "spent" (sum of transactions in
// the budget's category for the current month) and "latestSpending" (last 3
// transactions for that category). This requires joining/aggregating against
// the transactions table.

export const getAll = async (userId: string) => {
  return db.query.budgets.findMany({
    where: eq(budgets.userId, userId),
    with: {
      category: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getById = async (userId: string, id: string) => {
  return db.query.budgets.findFirst({
    where: and(eq(budgets.id, id), eq(budgets.userId, userId)),
    with: {
      category: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const create = async (userId: string, data: CreateBudget) => {
  const [created] = await db
    .insert(budgets)
    .values({ ...data, userId })
    .returning();

  return created;
};

export const update = async (
  userId: string,
  id: string,
  data: UpdateBudget,
) => {
  const [updated] = await db
    .update(budgets)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
    .returning();

  return updated ?? null;
};

export const remove = async (userId: string, id: string) => {
  const [deleted] = await db
    .delete(budgets)
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
    .returning();

  return deleted ?? null;
};
