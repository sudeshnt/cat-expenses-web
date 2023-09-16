import { ExpensesTable } from "../components/ExpensesTable";
import { prisma } from "@/db";

export default async function Home() {
  const expenses = await prisma.catExpense.findMany();

  return (
    <main className="flex h-screen flex-col items-center py-20 bg-[url('/cat-background.jpg')] bg-cover bg-center">
      <div className="w-full h-full max-w-3xl p-6 bg-slate-200 bg-opacity-95">
        <ExpensesTable expenses={expenses} />
      </div>
    </main>
  );
}
