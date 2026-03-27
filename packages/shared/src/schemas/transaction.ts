import { z } from "zod";
import { CategorySchema } from "./category";
import { PaginationQuerySchema } from "./pagination";

export const TransactionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  avatar: z.string().nullable(),
  name: z.string().min(1),
  categoryId: z.uuid(),
  date: z.coerce.date(),
  amount: z.string(),
  recurring: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const TransactionWithCategorySchema = TransactionSchema.extend({
  category: CategorySchema.pick({ id: true, name: true }),
});

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export const TransactionSortSchema = z.enum([
  "latest",
  "oldest",
  "a-z",
  "z-a",
  "highest",
  "lowest",
]);

export const TransactionQuerySchema = PaginationQuerySchema.extend({
  sort: TransactionSortSchema.default("latest"),
  category: z.string().optional(),
  search: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionWithCategory = z.infer<
  typeof TransactionWithCategorySchema
>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
export type TransactionSort = z.infer<typeof TransactionSortSchema>;
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;
