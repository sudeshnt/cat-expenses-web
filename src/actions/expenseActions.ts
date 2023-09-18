"use server";

import { CatExpenseFormData } from "@/components/types";
import { revalidatePath } from "next/cache";
import { connectToMongoDB, Expense } from "../../db";

/**
 * Creates a new expense record in the MongoDB database.
 *
 * @async
 * @function
 * @param {CatExpenseFormData} data - The expense data to be stored.
 * @throws {Error} Throws an error if the creation of the expense fails.
 * @returns {Promise<void>}
 */
export async function createExpense(data: CatExpenseFormData) {
  try {
    await connectToMongoDB();
    await Expense.create(data);
    revalidatePath("/");
  } catch (error) {
    throw new Error("Create expense failed!");
  }
}

/**
 * Edits an existing expense record in the MongoDB database.
 *
 * @async
 * @function
 * @param {string} id - The unique identifier of the expense to be edited.
 * @param {CatExpenseFormData} data - The updated expense data.
 * @throws {Error} Throws an error if editing the expense fails.
 * @returns {Promise<void>}
 */
export async function editExpense(id: string, data: CatExpenseFormData) {
  try {
    await connectToMongoDB();
    await Expense.updateOne(
      {
        id,
      },
      data
    );
    revalidatePath("/");
  } catch (error) {
    throw new Error("Edit expense failed!");
  }
}

/**
 * Deletes multiple expense records from the MongoDB database based on their unique identifiers.
 *
 * @async
 * @function
 * @param {string[]} idList - An array of unique identifiers for the expenses to be deleted.
 * @throws {Error} Throws an error if deleting the expenses fails.
 * @returns {Promise<void>}
 */
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

/**
 * Populates expenses data in the MongoDB database.
 *
 * @async
 * @function
 * @param {CatExpenseFormData[]} data - An array of expense data to be inserted.
 * @throws {Error} Throws an error if the operation fails.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function populateExpenses(data: CatExpenseFormData[]) {
  try {
    await connectToMongoDB();
    await Expense.insertMany(data);
    revalidatePath("/");
  } catch (error) {
    throw new Error("Create expense failed!");
  }
}
