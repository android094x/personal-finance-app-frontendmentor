import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

import type {
  CreateTransaction,
  TransactionQuery,
  TransactionSort,
  UpdateTransaction,
} from "@finance/shared";

import db from "@/db";
import { transactions } from "@/db/schema";

const ORDER_BY: Record<TransactionSort, ReturnType<typeof desc>> = {
  latest: desc(transactions.date),
  oldest: asc(transactions.date),
  "a-z": asc(transactions.name),
  "z-a": desc(transactions.name),
  highest: desc(transactions.amount),
  lowest: asc(transactions.amount),
};

const buildConditions = (userId: string, options: TransactionQuery) => {
  const conditions = [eq(transactions.userId, userId)];

  if (options.search) {
    conditions.push(ilike(transactions.name, `%${options.search}%`));
  }

  if (options.category) {
    conditions.push(eq(transactions.categoryId, options.category));
  }

  return conditions;
};

export const getAll = async (userId: string, options: TransactionQuery) => {
  const conditions = buildConditions(userId, options);
  const offset = (options.page - 1) * options.limit;

  const [{ total }] = await db
    .select({ total: count() })
    .from(transactions)
    .where(and(...conditions));

  const data = await db.query.transactions.findMany({
    where: and(...conditions),
    with: {
      category: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    limit: options.limit,
    offset,
    orderBy: ORDER_BY[options.sort],
  });

  return {
    transactions: data,
    pagination: {
      page: options.page,
      limit: options.limit,
      totalItems: total,
      totalPages: Math.ceil(total / options.limit),
    },
  };
};

export const getById = async (userId: string, id: string) => {
  return db.query.transactions.findFirst({
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
};

export const create = async (
  userId: string,
  data: CreateTransaction,
) => {
  const [created] = await db
    .insert(transactions)
    .values({ ...data, userId })
    .returning();

  return created;
};

export const update = async (
  userId: string,
  id: string,
  data: UpdateTransaction,
) => {
  const [updated] = await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();

  return updated ?? null;
};

export const remove = async (userId: string, id: string) => {
  const [deleted] = await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();

  return deleted ?? null;
};
