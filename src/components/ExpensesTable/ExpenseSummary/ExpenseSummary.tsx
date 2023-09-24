import { HStack, Tag, Text, Tooltip } from "@chakra-ui/react";
import { numberToUSD } from "../utils/currencyUtils";

export type HighestSpendingCategoryResult = {
  highestSpending: number;
  highestSpendingCategories: string[];
};

type ExpenseSummaryProps = HighestSpendingCategoryResult & {
  totalSpending: number;
};

export const ExpenseSummary = (props: ExpenseSummaryProps): JSX.Element => {
  const { highestSpending, highestSpendingCategories, totalSpending } = props;

  return (
    <>
      <HStack spacing={2}>
        <Text fontSize="sm" color="gray.600" ml={2}>
          Highest Spending Category:
        </Text>
        {highestSpendingCategories.map((category) => (
          <Tooltip key={category} label={numberToUSD(highestSpending)}>
            <Tag key={category}>{category}</Tag>
          </Tooltip>
        ))}
      </HStack>
      <HStack spacing={2}>
        <Text fontSize="sm" color="gray.600" ml={2}>
          Total Spending:
        </Text>
        <Tag>{numberToUSD(totalSpending)}</Tag>
      </HStack>
    </>
  );
};
