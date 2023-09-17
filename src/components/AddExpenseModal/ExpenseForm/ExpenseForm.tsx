import { CatExpenseCategory, CatExpenseFormData } from "@/components/types";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import { BaseSyntheticEvent } from "react";
import { FormState, UseFormRegister } from "react-hook-form";

type ExpenseFormProps = {
  register: UseFormRegister<CatExpenseFormData>;
  onSubmit: (e?: BaseSyntheticEvent<object> | undefined) => Promise<void>;
  onClose: () => void;
  formState: FormState<CatExpenseFormData>;
  isLoading: boolean;
};

export const ExpenseForm = (props: ExpenseFormProps): JSX.Element => {
  const { onSubmit, isLoading, onClose, register, formState } = props;
  const { isValid, errors } = formState;

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={5}>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel fontSize="sm" m={1} color="GrayText">
            Item
          </FormLabel>
          <Input
            type="text"
            placeholder="Enter Item Name"
            {...register("name")}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.category}>
          <FormLabel fontSize="sm" m={1} color="GrayText">
            Category
          </FormLabel>
          <Select placeholder="Select option" {...register("category")}>
            {Object.values(CatExpenseCategory).map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.amount}>
          <FormLabel fontSize="sm" m={1} color="GrayText">
            Amount
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
              children="$"
            />
            <Input
              type="number"
              {...register("amount", {
                valueAsNumber: true,
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>
        <HStack w="full" p={2} justify="flex-end">
          <Button
            variant="outline"
            colorScheme="yellow"
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="outline"
            colorScheme="yellow"
            isDisabled={!isValid}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
