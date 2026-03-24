import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/pots")({
  component: PotsPage,
});

function PotsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-grey-900 text-xl font-bold">Pots</h1>
      <div className="rounded-xl bg-white p-6">
        <p className="text-grey-500">Pots feature coming soon.</p>
      </div>
    </div>
  );
}
