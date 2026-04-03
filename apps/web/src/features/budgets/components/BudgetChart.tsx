import {
  PieChart,
  Pie,
  ResponsiveContainer,
  type PieSectorShapeProps,
  Sector,
} from "recharts";

import type { BudgetWithSpending } from "@finance/shared";
import { formatCurrency } from "@/lib/utils";

interface BudgetChartProps {
  budgets: BudgetWithSpending[];
}

const CustomPie = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={props.payload.fill} stroke="none" />;
};

interface SpendingSummaryItemProps {
  name: string;
  theme: string;
  spent: number;
  maximum: number;
}

const SpendingSummaryItem = ({
  name,
  theme,
  spent,
  maximum,
}: SpendingSummaryItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4 self-stretch">
      <span
        className="block w-1 self-stretch rounded-lg"
        style={{ background: theme }}
      />
      <span className="text-grey-500 text-sm">{name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-grey-900 text-md font-bold">
        {formatCurrency(spent)}
      </span>
      <span className="text-grey-500 text-xs">
        of {formatCurrency(maximum)}
      </span>
    </div>
  </div>
);

const BudgetChart = ({ budgets }: BudgetChartProps) => {
  const chartData = budgets.map((b) => ({
    name: b.category.name,
    value: Number(b.maximum),
    fill: b.theme,
  }));

  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent), 0);
  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.maximum), 0);

  return (
    <div className="flex flex-col gap-8 rounded-xl bg-white p-5 md:p-8 lg:gap-8">
      {/* Responsive layout: stacked on mobile, side-by-side on tablet, stacked on desktop */}
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-8 lg:flex-col">
        {/* Donut Chart */}
        <div className="flex h-[280px] items-center justify-center md:flex-1 lg:w-full">
          <div className="relative size-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={0}
                  dataKey="value"
                  shape={CustomPie}
                  isAnimationActive={true}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute top-1/2 left-1/2 flex size-[80%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white/25">
              <span className="text-grey-900 text-xl font-bold">
                {formatCurrency(totalSpent, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-grey-500 mt-2 text-xs">
                {`of ${formatCurrency(totalLimit, { maximumFractionDigits: 0 })} limit`}
              </span>
            </div>
          </div>
        </div>

        {/* Spending Summary */}
        <div className="flex w-full flex-col gap-6 md:flex-1 lg:w-full">
          <h2 className="text-grey-900 text-lg font-bold">Spending Summary</h2>
          <div className="flex flex-col gap-4">
            {budgets.map((budget, index) => (
              <div key={budget.id}>
                {index > 0 && (
                  <div className="bg-grey-100 mb-4 h-px w-full" />
                )}
                <SpendingSummaryItem
                  name={budget.category.name}
                  theme={budget.theme}
                  spent={Number(budget.spent)}
                  maximum={Number(budget.maximum)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
