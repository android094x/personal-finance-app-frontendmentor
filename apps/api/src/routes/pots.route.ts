import { Router } from "express";
import { z } from "zod";

import {
  CreatePotSchema,
  PotTransactionAmountSchema,
  UpdatePotSchema,
} from "@finance/shared";

import {
  createPot,
  deletePot,
  depositToPot,
  getAllPots,
  getPotById,
  updatePot,
  withdrawFromPot,
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

router.post(
  "/:id/deposit",
  validateParams(ParamsSchema),
  validateBody(PotTransactionAmountSchema),
  depositToPot,
);

router.post(
  "/:id/withdraw",
  validateParams(ParamsSchema),
  validateBody(PotTransactionAmountSchema),
  withdrawFromPot,
);

export default router;
