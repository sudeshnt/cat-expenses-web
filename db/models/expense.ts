import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const expenseSchema: Schema = new Schema({
  id: {
    type: String,
    default: () => uuidv4(),
  },
  name: String,
  category: String,
  amount: Number,
});

export const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
