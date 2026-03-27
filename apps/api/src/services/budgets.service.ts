import { and, desc, eq, gte, lt, sql } from "drizzle-orm";

import type { CreateBudget, UpdateBudget } from "@finance/shared";

import db from "@/db";
import { budgets, categories, transactions } from "@/db/schema";

const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
};

export const getAll = async (userId: string) => {
  const { start, end } = getCurrentMonthRange();

  // 1. Budgets + spent per category this month
  const budgetRows = await db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      maximum: budgets.maximum,
      theme: budgets.theme,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
      spent: sql<string>`COALESCE(ABS(SUM(${transactions.amount})), '0')`,
    })
    .from(budgets)
    .leftJoin(categories, eq(categories.id, budgets.categoryId))
    .leftJoin(
      transactions,
      and(
        eq(transactions.categoryId, budgets.categoryId),
        eq(transactions.userId, budgets.userId),
        gte(transactions.date, start),
        lt(transactions.date, end),
      ),
    )
    .where(eq(budgets.userId, userId))
    .groupBy(budgets.id, categories.id, categories.name);

  // 2. Last 3 transactions per budget category this month
  const categoryIds = budgetRows.map((b) => b.categoryId);

  const recentTransactions = categoryIds.length
    ? await db
        .select({
          id: transactions.id,
          avatar: transactions.avatar,
          name: transactions.name,
          amount: transactions.amount,
          date: transactions.date,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            sql`${transactions.categoryId} IN ${categoryIds}`,
            gte(transactions.date, start),
            lt(transactions.date, end),
          ),
        )
        .orderBy(desc(transactions.date))
    : [];

  // 3. Group transactions by categoryId and take top 3 each
  const txByCategory = new Map<string, typeof recentTransactions>();
  for (const tx of recentTransactions) {
    const list = txByCategory.get(tx.categoryId) ?? [];
    if (list.length < 3) {
      list.push(tx);
      txByCategory.set(tx.categoryId, list);
    }
  }

  return budgetRows.map((budget) => ({
    ...budget,
    latestSpending: txByCategory.get(budget.categoryId) ?? [],
  }));
};

export const getById = async (userId: string, id: string) => {
  const { start, end } = getCurrentMonthRange();

  const [budget] = await db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      maximum: budgets.maximum,
      theme: budgets.theme,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
      spent: sql<string>`COALESCE(ABS(SUM(${transactions.amount})), '0')`,
    })
    .from(budgets)
    .leftJoin(categories, eq(categories.id, budgets.categoryId))
    .leftJoin(
      transactions,
      and(
        eq(transactions.categoryId, budgets.categoryId),
        eq(transactions.userId, budgets.userId),
        gte(transactions.date, start),
        lt(transactions.date, end),
      ),
    )
    .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
    .groupBy(budgets.id, categories.id, categories.name);

  return budget ?? null;
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
