import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  type PieSectorShapeProps,
  Sector,
} from "recharts";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Budget {
  spent: number;
  id: string;
  category: string;
  maximum: string;
  theme: string;
}

interface OverviewBudgetsProps {
  budgets: Budget[];
}

const CustomPie = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={props.payload.fill} stroke="none" />;
};

const OverviewBudgets = ({ budgets }: OverviewBudgetsProps) => {
  const chartData = budgets.map((b) => ({
    name: b.category,
    value: Number(b.maximum),
    fill: b.theme,
  }));

  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.maximum), 0);

  if (budgets.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-grey-900 text-lg font-bold">Budgets</h2>
        <Button variant="tertiary" size="text" asChild>
          <Link to="/budgets">
            See Details
            <CaretRightIcon weight="fill" className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center gap-4 py-8 md:flex-row">
        <div className="flex flex-1 justify-center">
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

        {/* Budgets */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          {budgets.map((budget) => (
            <div key={budget.id} className="flex gap-4">
              <span
                className="block h-full w-1 rounded-lg"
                style={{ background: budget.theme }}
              />
              <div className="space-y-1">
                <h3 className="text-grey-500 text-xs">{budget.category}</h3>
                <p className="text-grey-900 text-sm font-bold">
                  {formatCurrency(Number(budget.maximum))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewBudgets;
