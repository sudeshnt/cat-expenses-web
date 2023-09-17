import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const expenseSchema = new Schema({
  id: {
    type: String,
    default: () => uuidv4(),
  },
  name: String,
  category: String,
  amount: Number,
});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
