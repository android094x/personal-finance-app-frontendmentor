import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.uuid(),
  avatar: z.string().nullable(),
  name: z.string().min(1),
  category: z.string().min(1),
  date: z.date(),
  amount: z.string(),
  recurring: z.boolean(),
  createdAt: z.date(),
});

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
