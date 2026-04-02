import { db } from "./index";
import {
  users,
  categories,
  transactions,
  budgets,
  pots,
  potTransactions,
} from "./schema";
import { hashPassword } from "../utils/password";
import data from "../../data.json";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Step 1: Clear existing data (order matters for foreign keys)
    console.log("Clearing existing data...");
    await db.delete(potTransactions);
    await db.delete(transactions);
    await db.delete(budgets);
    await db.delete(pots);
    await db.delete(categories);
    await db.delete(users);

    // Step 2: Create demo user
    console.log("Creating demo user...");
    const hashedPassword = await hashPassword("demo1234");

    const [demoUser] = await db
      .insert(users)
      .values({
        email: "demo@finance.com",
        password: hashedPassword,
        name: "Demo User",
      })
      .returning();

    // Step 3: Create categories (assigned to demo user)
    console.log("Creating categories...");
    const categoryNames = [
      ...new Set(data.transactions.map((t) => t.category)),
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(categoryNames.map((name) => ({ name, userId: demoUser.id })))
      .returning();

    // Build a lookup map: category name -> category id
    const categoryMap = new Map(insertedCategories.map((c) => [c.name, c.id]));

    // Step 4: Create transactions
    console.log("Creating transactions...");
    await db.insert(transactions).values(
      data.transactions.map((t) => ({
        userId: demoUser.id,
        avatar: t.avatar,
        name: t.name,
        categoryId: categoryMap.get(t.category)!,
        date: new Date(t.date),
        amount: t.amount.toString(),
        recurring: t.recurring,
      })),
    );

    // Step 5: Create budgets
    console.log("Creating budgets...");
    await db.insert(budgets).values(
      data.budgets.map((b) => ({
        userId: demoUser.id,
        categoryId: categoryMap.get(b.category)!,
        maximum: b.maximum.toString(),
        theme: b.theme,
      })),
    );

    // Step 6: Create pots
    console.log("Creating pots...");
    await db.insert(pots).values(
      data.pots.map((p) => ({
        userId: demoUser.id,
        name: p.name,
        target: p.target.toString(),
        total: p.total.toString(),
        theme: p.theme,
      })),
    );

    // Summary
    console.log("\nDatabase seeded successfully!");
    console.log("\nSeed Summary:");
    console.log(`- Categories: ${insertedCategories.length}`);
    console.log(`- Transactions: ${data.transactions.length}`);
    console.log(`- Budgets: ${data.budgets.length}`);
    console.log(`- Pots: ${data.pots.length}`);
    console.log("\nLogin Credentials:");
    console.log("Email: demo@finance.com");
    console.log("Password: demo1234");
  } catch (error) {
    console.error("Seed failed:", error);
    throw error;
  }
}

console.log("import.meta.url", import.meta.url);
console.log(`file://${process.argv[1]}`);

// if (import.meta.url === `file://${process.argv[1]}`) {
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// }

export default seed;
