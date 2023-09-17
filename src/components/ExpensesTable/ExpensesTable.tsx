"use client";

import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import { ChangeEvent, useMemo, useState } from "react";
import { AddExpenseModal } from "../AddExpenseModal";
import { DeleteExpenses } from "../DeleteExpenseModal";
import { Expense } from "../types";
import { numberToUSD } from "./utils/currencyUtils";

type ExpensesTableProps = {
  expenses: Expense[];
};

type HighestSpendingCategoryResult = {
  highestSpending: number;
  highestSpendingCategories: string[];
};

export const ExpensesTable = (props: ExpensesTableProps) => {
  const { expenses } = props;

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<Set<string>>(
    new Set()
  );

  const handleSelectExpenseRow = (id: string) => {
    setSelectedExpenseIds((prev) => {
      const selectedIds = new Set(prev);
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
      } else {
        selectedIds.add(id);
      }
      return selectedIds;
    });
  };

  const handleSelectAllExpenseRows = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedExpenseIds(
      e.target.checked
        ? new Set(expenses.map((expense) => expense.id))
        : new Set()
    );
  };

  const highestSpendingCategories = useMemo(() => {
    if (expenses.length === 0) return [];

    const expenseGroups = groupBy(expenses, "category");

    const result = Object.entries(expenseGroups).reduce(
      (acc, [category, expenses]) => {
        const totalSpend = sumBy(expenses, "amount");
        if (totalSpend > acc.highestSpending) {
          return {
            highestSpending: totalSpend,
            highestSpendingCategories: [category],
          };
        } else if (totalSpend === acc.highestSpending) {
          acc.highestSpendingCategories.push(category);
        }
        return acc;
      },
      {
        highestSpending: 0,
        highestSpendingCategories: [],
      } as HighestSpendingCategoryResult
    );

    return result.highestSpendingCategories;
  }, [expenses]);

  return (
    <>
      <HStack spacing={4} pb={6} direction="row" justify="flex-end">
        <AddExpenseModal
          editingExpense={editingExpense}
          setEditingExpense={setEditingExpense}
        />
        <DeleteExpenses
          selectedExpenseIds={selectedExpenseIds}
          setSelectedExpenseIds={setSelectedExpenseIds}
        />
      </HStack>
      <TableContainer className="max-h-[calc(100%-70px)]" overflowY="scroll">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  borderColor="yellow.600"
                  onChange={handleSelectAllExpenseRows}
                />
              </Th>
              <Th>Item</Th>
              <Th>Category</Th>
              <Th isNumeric>Amount</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.map((expense, index) => (
              <Tr
                key={expense.id}
                bgColor={
                  highestSpendingCategories.includes(expense.category)
                    ? "gray.300"
                    : ""
                }
              >
                <Td>
                  <Checkbox
                    borderColor="yellow.600"
                    isChecked={selectedExpenseIds.has(expense.id)}
                    onChange={(e) => handleSelectExpenseRow(expense.id)}
                  />
                </Td>
                <Td>{expense.name}</Td>
                <Td>{expense.category}</Td>
                <Td isNumeric>{numberToUSD(expense.amount)}</Td>
                <Td w={1}>
                  <Button onClick={(_) => setEditingExpense(expense)}>
                    <EditIcon color="yellow.700" />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
