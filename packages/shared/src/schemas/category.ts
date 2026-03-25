import { z } from "zod";

export const CategorySchema = z.object({
  id: z.uuid(),
  userId: z.uuid().nullable(),
  name: z.string().min(1).max(50),
  createdAt: z.coerce.date(),
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
