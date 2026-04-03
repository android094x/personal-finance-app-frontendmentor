import { z } from "zod";
import { CategorySchema } from "./category";
import { TransactionSchema } from "./transaction";

export const BudgetSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  categoryId: z.uuid(),
  maximum: z.string(),
  theme: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const BudgetSpendingTransactionSchema = TransactionSchema.pick({
  id: true,
  avatar: true,
  name: true,
  amount: true,
  date: true,
  categoryId: true,
});

export const BudgetWithSpendingSchema = BudgetSchema.omit({
  userId: true,
}).extend({
  category: CategorySchema.pick({ id: true, name: true }),
  spent: z.string(),
  latestSpending: z.array(BudgetSpendingTransactionSchema),
});

export const CreateBudgetSchema = BudgetSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateBudgetSchema = CreateBudgetSchema.partial();

export type Budget = z.infer<typeof BudgetSchema>;
export type BudgetSpendingTransaction = z.infer<
  typeof BudgetSpendingTransactionSchema
>;
export type BudgetWithSpending = z.infer<typeof BudgetWithSpendingSchema>;
export type CreateBudget = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudget = z.infer<typeof UpdateBudgetSchema>;
