import { and, eq, isNull, or } from "drizzle-orm";

import type { CreateCategory, UpdateCategory } from "@finance/shared";

import db from "@/db";
import { categories } from "@/db/schema";

export const getAll = async (userId: string) => {
  return db.query.categories.findMany({
    where: or(isNull(categories.userId), eq(categories.userId, userId)),
    columns: {
      id: true,
      name: true,
      userId: true,
    },
  });
};

export const create = async (userId: string, data: CreateCategory) => {
  const [created] = await db
    .insert(categories)
    .values({ ...data, userId })
    .returning();

  return created;
};

export const update = async (
  userId: string,
  id: string,
  data: UpdateCategory,
) => {
  const [updated] = await db
    .update(categories)
    .set(data)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  return updated ?? null;
};

export const remove = async (userId: string, id: string) => {
  const [deleted] = await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  return deleted ?? null;
};
