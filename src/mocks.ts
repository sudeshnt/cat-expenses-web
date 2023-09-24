import { CatExpenseCategory as Category, CatExpenseFormData } from "@/types";

export const MOCK_EXPENSES = [
  { name: "Cat Food", category: Category.Food, amount: 25.95 },
  { name: "Litter Box", category: Category.Furniture, amount: 59.99 },
  { name: "Cat Toys", category: Category.Accessory, amount: 12.49 },
  {
    name: "Veterinary Checkup",
    category: Category.Accessory,
    amount: 75.0,
  },
  { name: "Cat Bed", category: Category.Furniture, amount: 39.95 },
  { name: "Canned Cat Food", category: Category.Food, amount: 18.75 },
  {
    name: "Scratching Post",
    category: Category.Furniture,
    amount: 32.99,
  },
  { name: "Cat Treats", category: Category.Food, amount: 8.99 },
  {
    name: "Grooming Supplies",
    category: Category.Accessory,
    amount: 24.5,
  },
  {
    name: "Cat Carrier",
    category: Category.Accessory,
    amount: 44.95,
  },
  {
    name: "Cat Insurance",
    category: Category.Accessory,
    amount: 29.99,
  },
  { name: "Cat Collar", category: Category.Accessory, amount: 7.95 },
  { name: "Dry Cat Food", category: Category.Food, amount: 29.99 },
  { name: "Cat Litter", category: Category.Accessory, amount: 14.99 },
  {
    name: "Cat Fountain",
    category: Category.Furniture,
    amount: 54.95,
  },
  {
    name: "Cat Nail Clippers",
    category: Category.Accessory,
    amount: 9.99,
  },
  { name: "Cat Brush", category: Category.Accessory, amount: 11.5 },
  {
    name: "Cat Medication",
    category: Category.Accessory,
    amount: 35.25,
  },
  { name: "Cat Shampoo", category: Category.Accessory, amount: 6.99 },
  {
    name: "Cat Scratcher",
    category: Category.Furniture,
    amount: 19.99,
  },
] satisfies CatExpenseFormData[];
