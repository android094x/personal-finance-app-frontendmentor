import { db } from "@/db";
import { transactions, budgets, pots } from "@/db/schema";
import data from "../../data.json";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clean existing data (Optional: removes old data to avoid duplicates)
  await db.delete(transactions);
  await db.delete(budgets);
  await db.delete(pots);

  // 2. Insert Budgets
  const budgetData = data.budgets.map((b) => ({
    category: b.category,
    maximum: b.maximum.toString(),
    theme: b.theme,
  }));
  if (budgetData.length > 0) {
    await db.insert(budgets).values(budgetData);
  }

  // 3. Insert Pots
  const potData = data.pots.map((p) => ({
    name: p.name,
    target: p.target.toString(),
    total: p.total.toString(),
    theme: p.theme,
  }));
  if (potData.length > 0) {
    await db.insert(pots).values(potData);
  }

  // 4. Insert Transactions
  const transactionData = data.transactions.map((t) => ({
    name: t.name,
    category: t.category,
    date: new Date(t.date),
    amount: t.amount.toString(),
    recurring: t.recurring,
    avatar: t.avatar, // Ensure images are in public/assets
  }));
  if (transactionData.length > 0) {
    await db.insert(transactions).values(transactionData);
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
