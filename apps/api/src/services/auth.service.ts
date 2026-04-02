import { eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";
import { generateToken } from "@/utils/jwt";
import { comparePasswords, hashPassword } from "@/utils/password";
import type { Login, Register } from "@finance/shared";

export const registerUser = async (data: Register) => {
  const hashedPassword = await hashPassword(data.password);

  const [newUser] = await db
    .insert(users)
    .values({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
    });

  const token = await generateToken({
    id: newUser.id,
    email: newUser.email,
  });

  return { user: newUser, token };
};

export const loginUser = async ({ email, password }: Login) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) return null;

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) return null;

  const token = await generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};
