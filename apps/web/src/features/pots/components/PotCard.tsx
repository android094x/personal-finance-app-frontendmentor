import type { Pot } from "@finance/shared";
import { Button } from "@/components/ui/button";
import { ActionsDropdown } from "@/components/shared/ActionsDropdown";
import { formatCurrency } from "@/lib/utils";

interface PotCardProps {
  pot: Pot;
  onEdit: () => void;
  onDelete: () => void;
  onAddMoney: () => void;
  onWithdraw: () => void;
}

export function PotCard({
  pot,
  onEdit,
  onDelete,
  onAddMoney,
  onWithdraw,
}: PotCardProps) {
  const total = Number(pot.total);
  const target = Number(pot.target);
  const percentage = target > 0 ? Math.min((total / target) * 100, 100) : 0;

  return (
    <div className="flex flex-col gap-8 rounded-xl bg-white p-5 md:p-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="block size-4 rounded-full"
            style={{ background: pot.theme }}
          />
          <h3 className="text-grey-900 text-lg font-bold">{pot.name}</h3>
        </div>
        <ActionsDropdown onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-grey-500 text-sm">Total Saved</span>
          <span className="text-grey-900 text-xl font-bold">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Progress Bar */}
          <div className="bg-beige-100 h-2 overflow-hidden rounded">
            <div
              className="h-full rounded"
              style={{
                background: pot.theme,
                width: `${percentage}%`,
              }}
            />
          </div>

          {/* Percentage and Target */}
          <div className="flex items-start gap-2">
            <span className="text-grey-500 flex-1 text-xs font-bold">
              {percentage.toFixed(percentage % 1 === 0 ? 1 : 2)}%
            </span>
            <span className="text-grey-500 flex-1 text-right text-xs">
              Target of {formatCurrency(target)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onAddMoney}
        >
          + Add Money
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onWithdraw}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}
