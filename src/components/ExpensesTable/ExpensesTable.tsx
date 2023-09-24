"use client";

import { populateExpenses } from "@/actions/expenseActions";
import { MOCK_EXPENSES } from "@/mocks";
import { Expense } from "@/types";
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
  VStack,
  useToast,
} from "@chakra-ui/react";
import groupBy from "lodash/groupBy";
import sumBy from "lodash/sumBy";
import { ChangeEvent, useMemo, useState, useTransition } from "react";
import { AddExpenseModal } from "../AddExpenseModal";
import { DeleteExpenses } from "../DeleteExpenseModal";
import {
  ExpenseSummary,
  HighestSpendingCategoryResult,
} from "./ExpenseSummary";
import { numberToUSD } from "./utils/currencyUtils";

type ExpensesTableProps = {
  expenses: Expense[];
};

export const ExpensesTable = (props: ExpensesTableProps) => {
  const { expenses } = props;

  const toast = useToast();
  const [_, startTransition] = useTransition();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<Set<string>>(
    new Set()
  );

  const isSelectedAll = selectedExpenseIds.size === expenses.length;
  const isIndeterminate = !isSelectedAll && selectedExpenseIds.size > 0;

  const totalSpending = useMemo(
    () => expenses.reduce((acc, curr) => acc + curr.amount, 0),
    [expenses]
  );

  const { highestSpendingCategories, highestSpending } = useMemo(() => {
    const expenseGroups = groupBy(expenses, "category");

    return Object.entries(expenseGroups).reduce(
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
  }, [expenses]);

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

  const handleBulkCreateExpenses = () => {
    startTransition(() => {
      populateExpenses(MOCK_EXPENSES)
        .then((_) =>
          toast({
            title: "Expenses populated successfully",
            status: "success",
          })
        )
        .catch((error) =>
          toast({
            title: (error as Error).message,
            status: "error",
          })
        );
    });
  };

  return (
    <>
      <HStack spacing={4} pb={6} direction="row" justify="space-between">
        <VStack alignItems="flex-start">
          {highestSpendingCategories.length > 0 && (
            <ExpenseSummary
              highestSpendingCategories={highestSpendingCategories}
              highestSpending={highestSpending}
              totalSpending={totalSpending}
            />
          )}
        </VStack>
        <HStack spacing={2}>
          <AddExpenseModal
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
          />
          <DeleteExpenses
            selectedExpenseIds={selectedExpenseIds}
            setSelectedExpenseIds={setSelectedExpenseIds}
          />
        </HStack>
      </HStack>
      <TableContainer className="max-h-[calc(100%-70px)]" overflowY="scroll">
        <Table variant="simple">
          <Thead bg="#f1e0cf">
            <Tr>
              <Th>
                <Checkbox
                  colorScheme="orange"
                  borderColor="yellow.600"
                  isChecked={isSelectedAll}
                  isIndeterminate={isIndeterminate}
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
              expenses.map((expense) => (
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
                      onChange={(_) => handleSelectExpenseRow(expense.id)}
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
                    <Image src="./empty-state.svg" h={300} alt="empty-state" />
                    <Text fontSize="md" color="gray.600">
                      No expenses found!
                    </Text>
                    <Button
                      colorScheme="yellow"
                      size="xs"
                      onClick={handleBulkCreateExpenses}
                    >
                      Populate Table
                    </Button>
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
