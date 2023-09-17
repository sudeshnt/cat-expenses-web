import { connectToMongoDB, Expense } from "../../db";
import { ExpensesTable } from "../components/ExpensesTable";

export default async function Home() {
  await connectToMongoDB();
  const expenses = await Expense.find();

  return (
    <main className="flex h-screen flex-col items-center py-20">
      <div className="w-full h-full max-w-3xl p-6 bg-slate-200 bg-opacity-95">
        <ExpensesTable expenses={JSON.parse(JSON.stringify(expenses))} />
      </div>
    </main>
  );
}
