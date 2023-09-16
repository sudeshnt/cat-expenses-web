export enum CatExpenseCategory {
  Food = "Food",
  Furniture = "Furniture",
  Accessory = "Accessory",
}

export type CatExpenseFormData = {
  name: string;
  category: CatExpenseCategory;
  amount: number;
};
