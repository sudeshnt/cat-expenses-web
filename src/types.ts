export enum CatExpenseCategory {
  Food = "Food",
  Furniture = "Furniture",
  Accessory = "Accessory",
}

export type Expense = {
  id: string;
  name: string;
  category: CatExpenseCategory;
  amount: number;
};

export type CatExpenseFormData = {
  name: string;
  category: CatExpenseCategory;
  amount: number;
};
