"use client";

import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  HStack,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
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
          <Thead bg="#f1e0cf">
            <Tr>
              <Th>
                <Checkbox
                  colorScheme="orange"
                  borderColor="yellow.600"
                  onChange={handleSelectAllExpenseRows}
                />
              </Th>
              <Th fontSize="small">Item Name</Th>
              <Th fontSize="small">Category</Th>
              <Th isNumeric fontSize="small">
                Amount
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
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
                      colorScheme="orange"
                      borderColor="yellow.600"
                      isChecked={selectedExpenseIds.has(expense.id)}
                      onChange={(e) => handleSelectExpenseRow(expense.id)}
                    />
                  </Td>
                  <Td color="gray.600">{expense.name}</Td>
                  <Td color="gray.600">{expense.category}</Td>
                  <Td isNumeric color="gray.600">
                    {numberToUSD(expense.amount)}
                  </Td>
                  <Td w={1}>
                    <Button onClick={(_) => setEditingExpense(expense)}>
                      <EditIcon color="yellow.700" />
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5}>
                  <Stack alignItems="center">
                    <Image src="./empty-state.svg" h={300} />
                    <Text fontSize="md" color="gray.600">
                      No expenses found!
                    </Text>
                  </Stack>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
