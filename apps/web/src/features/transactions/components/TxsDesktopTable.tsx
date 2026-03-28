import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { type TransactionWithCategory } from "@finance/shared";

export const TxsDesktopTable = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  return (
    <table className="hidden md:table w-full">
      <thead>
        <tr className="text-left text-xs text-gray-500 [&>th]:font-normal border-b border-gray-100 [&>th]:py-3 [&>th]:px-4">
          <th className="w-[45%]" scope="col">
            Recipient/Sender
          </th>
          <th className="w-[15%]" scope="col">
            Category
          </th>
          <th className="w-[15%]" scope="col">
            Transaction Date
          </th>
          <th className="w-[25%] text-right" scope="col">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="">
        {transactions.map((tx) => (
          <tr
            key={tx.id}
            className="text-sm border-b border-gray-100 last:border-b-0 [&>td]:p-4 first:[&>td]:pt-6"
          >
            <td className="w-[45%]">
              <div className="flex items-center gap-4">
                {tx.avatar ? (
                  <img
                    src={tx.avatar}
                    alt={`${tx.name} avatar`}
                    className="size-10 rounded-full shrink-0"
                  />
                ) : (
                  <div className=" flex items-center justify-center size-10 rounded-full bg-gray-900 text-white">
                    {tx.name.split(" ")[0].charAt(0)}
                    {tx.name.split(" ")[1].charAt(0)}
                  </div>
                )}
                <p className="font-bold">{tx.name}</p>
              </div>
            </td>
            <td className="text-xs text-gray-500 w-[15%]">
              {tx.category.name}
            </td>
            <td className="text-xs text-gray-500 w-[15%]">
              {formatDate(new Date(tx.date))}
            </td>
            <td
              className={cn(
                "w-[25%] text-right font-bold",
                Number(tx.amount) > 0 ? "text-green" : "text-grey-900",
              )}
            >
              {formatCurrency(Number(tx.amount), { signDisplay: "always" })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
