import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionWithCategory } from "@finance/shared";

export const TxsMobileTable = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  return (
    <div className="md:hidden w-full">
      {transactions.map((tx) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center gap-4">
            {tx.avatar ? (
              <img
                src={tx.avatar}
                alt={`${tx.name} avatar`}
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className=" flex items-center justify-center size-10 rounded-full bg-gray-900 text-white">
                {tx.name.split(" ")[0].charAt(0)}
                {tx.name.split(" ")[1].charAt(0)}
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-bold">{tx.name}</p>
              <p className="text-xs text-gray-500">{tx.category.name}</p>
            </div>
          </div>
          <div className="text-end space-y-1">
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
              {formatDate(new Date(tx.date), {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
