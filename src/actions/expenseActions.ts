"use server";

import { CatExpenseFormData } from "@/components/AddExpenseModal/types";
import { prisma } from "@/db";
import { revalidatePath } from "next/cache";
import connectToMongoDB from "../../db/mongodb";
import Expense from "../../db/models/expense";

export async function createExpense(data: CatExpenseFormData) {
  try {
    // await prisma.catExpense.create({
    //   data,
    // });

    await connectToMongoDB();
    await Expense.create(data);
    revalidatePath("/");
  } catch (error) {
    throw new Error("Create expense failed!");
  }
}

export async function deleteExpenses(idList: string[]) {
  try {
    // await prisma.catExpense.deleteMany({
    //   where: {
    //     id: {
    //       in: data,
    //     },
    //   },
    // });
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
