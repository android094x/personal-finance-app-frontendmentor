import { cn, formatCurrency } from "@/lib/utils";

interface OverviewMetricsProps {
  balance: {
    current: number;
    income: number;
    expenses: number;
  };
}

const metricLabels = {
  current: "Current Balance",
  income: "Income",
  expenses: "Expenses",
};

const OverviewMetrics = ({ balance }: OverviewMetricsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Object.entries(balance).map(([key, value]) => (
        <div
          key={key}
          className={cn(
            "flex flex-col gap-3 rounded-xl p-6",
            key === "current"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-500",
          )}
        >
          <span className={cn("text-sm")}>
            {metricLabels[key as keyof typeof metricLabels]}
          </span>
          <span
            className={cn(
              "text-xl font-bold",
              key !== "current" ? "text-gray-900" : "",
            )}
          >
            {formatCurrency(value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default OverviewMetrics;
