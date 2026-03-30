import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionWithCategory } from "@finance/shared";

export const TxsMobileTable = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  return (
    <div className="flex w-full flex-col gap-4 md:hidden">
      {transactions.map((tx, index) => (
        <div key={tx.id}>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-3">
              {tx.avatar ? (
                <img
                  src={tx.avatar}
                  alt={`${tx.name} avatar`}
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                  {tx.name.split(" ")[0]?.charAt(0)}
                  {tx.name.split(" ")?.[1]?.charAt(0) ?? ""}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="text-grey-900 text-sm font-bold truncate">
                  {tx.name}
                </p>
                <p className="text-grey-500 text-xs">{tx.category.name}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p
                className={cn(
                  "text-sm font-bold",
                  Number(tx.amount) > 0 ? "text-green" : "text-grey-900",
                )}
              >
                {formatCurrency(Number(tx.amount), {
                  signDisplay: "always",
                })}
              </p>
              <p className="text-grey-500 text-xs">
                {formatDate(new Date(tx.date))}
              </p>
            </div>
          </div>
          {index < transactions.length - 1 && (
            <div className="border-grey-100 mt-4 border-b" />
          )}
        </div>
      ))}
    </div>
  );
};
