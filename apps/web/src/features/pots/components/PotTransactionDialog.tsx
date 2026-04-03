import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

import type { Pot } from "@finance/shared";

type TransactionType = "deposit" | "withdraw";

interface PotTransactionDialogProps {
  pot: Pot;
  type: TransactionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PotTransactionDialog({
  pot,
  type,
  open,
  onOpenChange,
}: PotTransactionDialogProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isDeposit = type === "deposit";
  const total = Number(pot.total);
  const target = Number(pot.target);
  const inputAmount = Number(amount) || 0;

  const newTotal = isDeposit
    ? total + inputAmount
    : Math.max(total - inputAmount, 0);
  const newPercentage = target > 0 ? Math.min((newTotal / target) * 100, 100) : 0;
  const currentPercentage = target > 0 ? Math.min((total / target) * 100, 100) : 0;

  // For the segmented bar visualization
  const changePercentage = target > 0
    ? Math.min((inputAmount / target) * 100, 100 - (isDeposit ? currentPercentage : 0))
    : 0;

  const handleSubmit = async () => {
    if (!inputAmount || inputAmount <= 0) return;

    setIsPending(true);
    try {
      const endpoint = isDeposit
        ? `/pots/${pot.id}/deposit`
        : `/pots/${pot.id}/withdraw`;
      await api.post(endpoint, { amount });
      onOpenChange(false);
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setAmount("");
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeposit
              ? `Add to '${pot.name}'`
              : `Withdraw from '${pot.name}'`}
          </DialogTitle>
          <DialogDescription>
            {isDeposit
              ? "Add money to your pot to keep your savings on track."
              : "Withdraw from your pot back to your main balance."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Preview */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-grey-500 text-sm">New Amount</span>
            <span className="text-grey-900 text-xl font-bold">
              {formatCurrency(newTotal)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Segmented Progress Bar */}
            <div className="bg-beige-100 flex h-2 overflow-hidden rounded">
              {isDeposit ? (
                <>
                  <div
                    className="bg-grey-900 h-full"
                    style={{ width: `${currentPercentage}%` }}
                  />
                  {inputAmount > 0 && (
                    <>
                      <div className="bg-grey-100 h-full w-0.5" />
                      <div
                        className="bg-green h-full rounded-r"
                        style={{ width: `${changePercentage}%` }}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <div
                    className="bg-grey-900 h-full"
                    style={{
                      width: `${Math.max(currentPercentage - changePercentage, 0)}%`,
                    }}
                  />
                  {inputAmount > 0 && (
                    <>
                      <div className="bg-grey-100 h-full w-0.5" />
                      <div
                        className="bg-red h-full rounded-r"
                        style={{ width: `${changePercentage}%` }}
                      />
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex items-start gap-2">
              <span
                className={`flex-1 text-xs font-bold ${
                  isDeposit ? "text-green" : "text-red"
                }`}
              >
                {newPercentage.toFixed(newPercentage % 1 === 0 ? 1 : 2)}%
              </span>
              <span className="text-grey-500 flex-1 text-right text-xs">
                Target of {formatCurrency(target)}
              </span>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1">
          <Label>
            {isDeposit ? "Amount to Add" : "Amount to Withdraw"}
          </Label>
          <div className="relative">
            <span className="text-beige-500 absolute top-1/2 left-5 -translate-y-1/2 text-sm">
              $
            </span>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g. 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!inputAmount || inputAmount <= 0 || isPending}
            className="w-full"
          >
            {isPending
              ? isDeposit
                ? "Adding..."
                : "Withdrawing..."
              : isDeposit
                ? "Confirm Addition"
                : "Confirm Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
