import type { Response } from "express";

import type { CreatePot, UpdatePot } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as potsService from "@/services/pots.service";

export const getAllPots = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const pots = await potsService.getAll(userId);

    res.json({ pots });
  } catch (error) {
    console.log(`Get pots error: ${error}`);
    res.status(500).json({ error: "Failed to fetch pots" });
  }
};

export const getPotById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const pot = await potsService.getById(userId, id);

    if (!pot) {
      res.status(404).json({ error: `Pot not found ${id}` });
      return;
    }

    res.json({ pot });
  } catch (error) {
    console.log(`Get pot error: ${error}`);
    res.status(500).json({ error: `Failed to fetch pot ${req.params.id}` });
  }
};

export const createPot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const pot = await potsService.create(userId, req.body as CreatePot);

    res.status(201).json({
      message: "Pot created successfully",
      pot,
    });
  } catch (error) {
    console.log(`Create pot error: ${error}`);
    res.status(500).json({ error: "Failed to create pot" });
  }
};

export const updatePot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const pot = await potsService.update(userId, id, req.body as UpdatePot);

    if (!pot) {
      res.status(404).json({ error: `Pot not found ${id}` });
      return;
    }

    res.json({
      message: "Pot updated successfully",
      pot,
    });
  } catch (error) {
    console.log(`Update pot error: ${error}`);
    res.status(500).json({ error: `Failed to update pot ${req.params.id}` });
  }
};

export const deletePot = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };
    const pot = await potsService.remove(userId, id);

    if (!pot) {
      res.status(404).json({ error: `Pot not found ${id}` });
      return;
    }

    res.json({ message: "Pot deleted successfully" });
  } catch (error) {
    console.log(`Delete pot error: ${error}`);
    res.status(500).json({ error: `Failed to delete pot ${req.params.id}` });
  }
};

// TODO: add deposit and withdraw controllers
// POST /:id/deposit   → validateBody(CreatePotTransactionSchema) → deposit
// POST /:id/withdraw  → validateBody(CreatePotTransactionSchema) → withdraw
