import type { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { generateToken } from "@/utils/jwt";
import { comparePasswords, hashPassword } from "@/utils/password";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Hash password with configurable rounds
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword, // Store hash, not plain text!
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      });

    // Generate JWT for auto-login
    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token, // User is logged in immediately
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Step 2: Verify password
    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Step 3: Generate JWT token
    const token = await generateToken({
      id: user.id,
      email: user.email,
    });

    // Step 4: Return user data and token
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};
