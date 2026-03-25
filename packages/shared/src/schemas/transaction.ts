import { z } from "zod";

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

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
