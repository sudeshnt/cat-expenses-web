"use server";

import { CatExpenseFormData } from "@/components/AddExpenseModal/types";
import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

export async function createExpense(data: CatExpenseFormData) {
  try {
    await prisma.catExpense.create({
      data,
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Create expense failed!");
  }
}

export async function deleteExpenses(data: string[]) {
  try {
    await prisma.catExpense.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    });
    revalidatePath("/");
  } catch (error) {
    throw new Error("Delete expense failed!");
  }
}
