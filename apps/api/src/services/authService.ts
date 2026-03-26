import { eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";
import { generateToken } from "@/utils/jwt";
import { comparePasswords, hashPassword } from "@/utils/password";

export const registerUser = async (data: {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
}) => {
  const hashedPassword = await hashPassword(data.password);

  const [newUser] = await db
    .insert(users)
    .values({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
    });

  const token = await generateToken({
    id: newUser.id,
    email: newUser.email,
  });

  return { user: newUser, token };
};

export const loginUser = async (email: string, password: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

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
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  };
};
