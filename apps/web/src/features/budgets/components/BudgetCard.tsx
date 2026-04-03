import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import type { BudgetWithSpending } from "@finance/shared";
import { Button } from "@/components/ui/button";
import { ActionsDropdown } from "@/components/shared/ActionsDropdown";
import { formatCurrency, formatDate } from "@/lib/utils";

interface BudgetCardProps {
  budget: BudgetWithSpending;
  onEdit: () => void;
  onDelete: () => void;
}

const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const maximum = Number(budget.maximum);
  const spent = Number(budget.spent);
  const remaining = Math.max(maximum - spent, 0);
  const spentPercentage = Math.min((spent / maximum) * 100, 100);

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white px-5 py-6 md:p-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="block size-4 rounded-full"
            style={{ background: budget.theme }}
          />
          <h3 className="text-grey-900 text-lg font-bold">
            {budget.category.name}
          </h3>
        </div>
        <ActionsDropdown onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Amount Bar */}
      <div className="flex flex-col gap-4">
        <p className="text-grey-500 text-sm">
          Maximum of {formatCurrency(maximum)}
        </p>

        {/* Progress Bar */}
        <div className="bg-beige-100 h-8 overflow-hidden rounded p-1">
          <div
            className="h-full rounded"
            style={{
              background: budget.theme,
              width: `${spentPercentage}%`,
            }}
          />
        </div>

        {/* Spent and Remaining */}
        <div className="flex gap-4">
          <div className="flex flex-1 items-center gap-4">
            <span
              className="block w-1 self-stretch rounded-lg"
              style={{ background: budget.theme }}
            />
            <div className="flex flex-col gap-1">
              <span className="text-grey-500 text-xs">Spent</span>
              <span className="text-grey-900 text-sm font-bold">
                {formatCurrency(spent)}
              </span>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <span className="bg-beige-100 block w-1 self-stretch rounded-lg" />
            <div className="flex flex-col gap-1">
              <span className="text-grey-500 text-xs">Remaining</span>
              <span className="text-grey-900 text-sm font-bold">
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Spending */}
      {budget.latestSpending.length > 0 && (
        <div className="bg-beige-100 flex flex-col gap-5 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-grey-900 text-md font-bold">
              Latest Spending
            </h4>
            <Button variant="tertiary" size="text" asChild>
              <Link
                to="/transactions"
                search={{ category: budget.category.name.toLowerCase() }}
              >
                <span className="text-sm leading-none">See All</span>
                <CaretRightIcon weight="fill" className="size-3" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {budget.latestSpending.map((tx, index) => (
              <div key={tx.id}>
                {index > 0 && (
                  <div className="bg-grey-500/15 mb-3 h-px w-full" />
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {tx.avatar && (
                      <img
                        src={tx.avatar}
                        alt=""
                        className="size-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-grey-900 text-xs font-bold">
                      {tx.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-grey-900 text-xs font-bold">
                      -{formatCurrency(Math.abs(Number(tx.amount)))}
                    </span>
                    <span className="text-grey-500 text-xs">
                      {formatDate(new Date(tx.date))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
