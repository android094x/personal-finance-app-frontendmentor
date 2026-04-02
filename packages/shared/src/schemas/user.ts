import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email().max(255),
  password: z.string().min(8).max(255),
  name: z.string().max(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const RegisterSchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
});

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type User = z.infer<typeof UserSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
