import { z } from "zod";

export const BudgetSchema = z.object({
  id: z.uuid(),
  category: z.string().min(1),
  maximum: z.string(),
  theme: z.string().min(1),
  createdAt: z.date(),
});

export const CreateBudgetSchema = BudgetSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateBudgetSchema = CreateBudgetSchema.partial();

export type Budget = z.infer<typeof BudgetSchema>;
export type CreateBudget = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudget = z.infer<typeof UpdateBudgetSchema>;
