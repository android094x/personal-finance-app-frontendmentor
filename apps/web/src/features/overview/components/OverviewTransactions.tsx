import * as React from "react";

import { Button } from "@/components/ui/button";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  avatar: string | null;
  name: string;
  category: string;
  date: Date;
  amount: string;
  recurring: boolean;
}

interface OverviewTransactiosnProps {
  transactions: Transaction[];
}

const OverviewTransactiosn = ({ transactions }: OverviewTransactiosnProps) => {
  return (
    <div className="flex flex-col gap-8 rounded-xl bg-white p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-grey-900 text-lg font-bold">Transactions</h2>
        <Button variant="tertiary" size="text" asChild>
          <Link to="/transactions">
            View All
            <CaretRightIcon weight="fill" className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col">
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            isLast={index === transactions.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

const TransactionItem = ({
  transaction,
  isLast,
}: {
  transaction: Transaction;
  isLast: boolean;
}) => {
  return (
    <React.Fragment key={transaction.id}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {transaction.avatar ? (
            <img
              src={transaction.avatar?.replace("./assets/", "/") || ""}
              alt={`${transaction.name} avatar`}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="bg-beige-100 flex size-10 items-center justify-center rounded-full">
              <p>{transaction.name.charAt(0).toUpperCase()}</p>
            </span>
          )}
          <p className="text-sm font-bold">{transaction.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p
            className={cn(
              "text-sm font-bold",
              Number(transaction.amount) > 0 ? "text-green" : "text-grey-900",
            )}
          >
            {formatCurrency(Number(transaction.amount), {
              signDisplay: "always",
            })}
          </p>
          <p className="text-grey-500 text-xs">
            {formatDate(transaction.date, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      {!isLast && <hr className="text-grey-100 my-5" />}
    </React.Fragment>
  );
};

export default OverviewTransactiosn;
