import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email().max(255),
  password: z.string().min(8).max(255),
  firstName: z.string().max(50).nullable(),
  lastName: z.string().max(50).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const RegisterSchema = UserSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type User = z.infer<typeof UserSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
