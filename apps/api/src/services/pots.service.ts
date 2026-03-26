import { and, eq, sql } from "drizzle-orm";

import type { CreatePot, UpdatePot } from "@finance/shared";

import db from "@/db";
import { pots, potTransactions } from "@/db/schema";

export const getAll = async (userId: string) => {
  return db.query.pots.findMany({
    where: eq(pots.userId, userId),
  });
};

export const getById = async (userId: string, id: string) => {
  return db.query.pots.findFirst({
    where: and(eq(pots.id, id), eq(pots.userId, userId)),
    with: {
      potTransactions: true,
    },
  });
};

export const create = async (userId: string, data: CreatePot) => {
  const [created] = await db
    .insert(pots)
    .values({ ...data, userId })
    .returning();

  return created;
};

export const update = async (
  userId: string,
  id: string,
  data: UpdatePot,
) => {
  const [updated] = await db
    .update(pots)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(pots.id, id), eq(pots.userId, userId)))
    .returning();

  return updated ?? null;
};

export const remove = async (userId: string, id: string) => {
  const [deleted] = await db
    .delete(pots)
    .where(and(eq(pots.id, id), eq(pots.userId, userId)))
    .returning();

  return deleted ?? null;
};

// TODO: deposit and withdraw should run inside a db transaction to keep
// pots.total and pot_transactions in sync. The logic:
//
// deposit(userId, potId, amount):
//   1. Verify pot belongs to user
//   2. Update pots.total += amount (guard against exceeding target?)
//   3. Insert pot_transactions record with type "deposit"
//   4. Return updated pot
//
// withdraw(userId, potId, amount):
//   1. Verify pot belongs to user
//   2. Verify pot.total >= amount (can't withdraw more than available)
//   3. Update pots.total -= amount
//   4. Insert pot_transactions record with type "withdrawal"
//   5. Return updated pot
//
// Use: db.transaction(async (tx) => { ... })
