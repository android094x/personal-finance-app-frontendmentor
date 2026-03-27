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

export const update = async (userId: string, id: string, data: UpdatePot) => {
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

export const deposit = async (
  userId: string,
  potId: string,
  amount: string,
) => {
  return db.transaction(async (tx) => {
    // 1. Verify pot belongs to user
    const [pot] = await tx
      .select()
      .from(pots)
      .where(and(eq(pots.id, potId), eq(pots.userId, userId)));

    if (!pot) return null;

    // 2. Update total atomically: total = total + amount
    const [updated] = await tx
      .update(pots)
      .set({
        total: sql`${pots.total} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(pots.id, potId))
      .returning();

    // 3. Record the transaction
    await tx.insert(potTransactions).values({
      potId,
      type: "deposit",
      amount,
    });

    return updated;
  });
};

export const withdraw = async (
  userId: string,
  potId: string,
  amount: string,
) => {
  return db.transaction(async (tx) => {
    // 1. Verify pot belongs to user
    const [pot] = await tx
      .select()
      .from(pots)
      .where(and(eq(pots.id, potId), eq(pots.userId, userId)));

    if (!pot) return null;

    // 2. Check sufficient funds
    if (Number(pot.total) < Number(amount)) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    // 3. Update total atomically: total = total - amount
    const [updated] = await tx
      .update(pots)
      .set({
        total: sql`${pots.total} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(pots.id, potId))
      .returning();

    // 4. Record the transaction
    await tx.insert(potTransactions).values({
      potId,
      type: "withdraw",
      amount,
    });

    return updated;
  });
};
