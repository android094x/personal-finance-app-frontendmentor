import { Router } from "express";

import { LoginSchema, RegisterSchema } from "@finance/shared";

import { login, register } from "@/controllers/authController";
import { validateBody } from "@/middleware/validation";

const router = Router();

router.post("/register", validateBody(RegisterSchema), register);

router.post("/login", validateBody(LoginSchema), login);

export default router;
