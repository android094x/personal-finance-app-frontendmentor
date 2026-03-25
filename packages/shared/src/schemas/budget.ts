import { z } from "zod";

export const BudgetSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  categoryId: z.uuid(),
  maximum: z.string(),
  theme: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateBudgetSchema = BudgetSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateBudgetSchema = CreateBudgetSchema.partial();

export type Budget = z.infer<typeof BudgetSchema>;
export type CreateBudget = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudget = z.infer<typeof UpdateBudgetSchema>;
