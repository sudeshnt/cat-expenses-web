"use server";

import { CatExpenseFormData } from "@/components/AddExpenseModal/types";
import { revalidatePath } from "next/cache";
import { connectToMongoDB, Expense } from "../../db";

export async function createExpense(data: CatExpenseFormData) {
  try {
    await connectToMongoDB();
    await Expense.create(data);
    revalidatePath("/");
  } catch (error) {
    throw new Error("Create expense failed!");
  }
}

export async function deleteExpenses(idList: string[]) {
  try {
    await connectToMongoDB();
    await Expense.deleteMany({
      id: {
        $in: idList,
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Delete expense failed!");
  }
}
