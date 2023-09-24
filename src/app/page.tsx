import { ExpensesTable } from "@/components/ExpensesTable";
import { Expense as ExpenseType } from "@/types";
import pick from "lodash/pick";
import { connectToMongoDB, Expense } from "../../db";

export default async function Home() {
  await connectToMongoDB();
  const expenses: ExpenseType[] = (await Expense.find()).map((expense) =>
    pick(expense, ["id", "name", "category", "amount"])
  );

  return (
    <main className="flex h-screen flex-col items-center py-[5vw]">
      <div className="flex flex-col w-full h-full p-6 bg-slate-200 bg-opacity-95 max-w-4xl">
        <ExpensesTable expenses={expenses} />
      </div>
    </main>
  );
}
