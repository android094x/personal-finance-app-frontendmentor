import { Router } from "express";
import { z } from "zod";

import { CreatePotSchema, UpdatePotSchema } from "@finance/shared";

import {
  createPot,
  deletePot,
  getAllPots,
  getPotById,
  updatePot,
} from "@/controllers/pots.controller";
import { authenticateToken } from "@/middleware/auth";
import { validateBody, validateParams } from "@/middleware/validation";

const ParamsSchema = z.object({
  id: z.uuid(),
});

const router = Router();

router.use(authenticateToken);

router.get("/", getAllPots);

router.get("/:id", validateParams(ParamsSchema), getPotById);

router.post("/", validateBody(CreatePotSchema), createPot);

router.patch(
  "/:id",
  validateParams(ParamsSchema),
  validateBody(UpdatePotSchema),
  updatePot,
);

router.delete("/:id", validateParams(ParamsSchema), deletePot);

// TODO: add deposit/withdraw routes
// router.post("/:id/deposit", validateParams(ParamsSchema), validateBody(CreatePotTransactionSchema), deposit);
// router.post("/:id/withdraw", validateParams(ParamsSchema), validateBody(CreatePotTransactionSchema), withdraw);

export default router;
