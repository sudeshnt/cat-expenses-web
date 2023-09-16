"use client";

import {
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
import { CatExpense } from "@prisma/client";
import { AddExpenseModal } from "../AddExpenseModal";
import { numberToUSD } from "./utils/currencyUtils";
import { useMemo, useState } from "react";
import { DeleteExpenses } from "./DeleteConfirmationAlert";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";

type ExpensesTableProps = {
  expenses: CatExpense[];
};

type HighestSpendingCategoryResult = {
  highestSpending: number;
  highestSpendingCategories: string[];
};

export const ExpensesTable = (props: ExpensesTableProps) => {
  const { expenses } = props;

  const [selectedExpenseIds, setSelectedExpenseIds] = useState<Set<string>>(
    new Set()
  );

  const handleSelectExpenseRow = (id: string) => {
    setSelectedExpenseIds((prev) => {
      const selectedIds = prev;
      if (selectedIds.has(id)) {
        selectedIds.delete(id);
      } else {
        selectedIds.add(id);
      }
      return selectedIds;
    });
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
        <AddExpenseModal />
        <DeleteExpenses
          selectedExpenseIds={selectedExpenseIds}
          setSelectedExpenseIds={setSelectedExpenseIds}
        />
      </HStack>
      <TableContainer className="max-h-full" overflowY="scroll">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Item</Th>
              <Th>Category</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.map((expense, index) => (
              <Tr
                key={expense.id}
                bgColor={
                  highestSpendingCategories.includes(expense.category)
                    ? "blue.100"
                    : ""
                }
              >
                <Td>
                  <Checkbox
                    borderColor="blue.600"
                    onChange={(e) => handleSelectExpenseRow(expense.id)}
                  />
                </Td>
                <Td>{expense.name}</Td>
                <Td>{expense.category}</Td>
                <Td isNumeric>{numberToUSD(expense.amount)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
