import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CaretRightIcon, TipJarIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

interface Pot {
  id: string;
  name: string;
  total: string;
  theme: string;
}

interface OverviewPotsProps {
  pots: Pot[];
}

const OverviewPots = ({ pots }: OverviewPotsProps) => {
  const totalSaved = pots.reduce((total, pot) => {
    return total + Number(pot.total);
  }, 0);

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-8 lg:@container">
      <div className="flex items-center justify-between">
        <h2 className="text-grey-900 text-lg font-bold">Pots</h2>
        <Button variant="tertiary" size="text" asChild>
          <Link to="/pots">
            See Details
            <CaretRightIcon weight="fill" className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-5 @max-sm:flex-col">
        <div className="bg-beige-100 flex flex-1 items-center gap-4 rounded-xl px-4 py-5">
          <TipJarIcon weight="fill" className="text-green size-10" />
          <div className="flex flex-col gap-3">
            <h3 className="text-grey-500 text-sm">Total Saved</h3>
            <p className="text-grey-900 text-xl font-bold">
              {formatCurrency(totalSaved, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4">
          {pots.slice(0, 4).map((pot) => (
            <div key={pot.id} className="flex gap-4">
              <span
                className="block h-full w-1 rounded-lg"
                style={{ background: pot.theme }}
              />
              <div className="space-y-1">
                <h3 className="text-grey-500 text-xs">{pot.name}</h3>
                <p className="text-grey-900 text-sm font-bold">
                  {formatCurrency(Number(pot.total), {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewPots;
