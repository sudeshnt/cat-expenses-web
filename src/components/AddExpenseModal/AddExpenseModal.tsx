"use client";

import * as z from "zod";

import { createExpense, editExpense } from "@/actions/expenseActions";
import { CatExpenseCategory, CatExpenseFormData, type Expense } from "@/types";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CatFact } from "./CatFact";

const defaultValues = {
  name: undefined,
  category: undefined,
  amount: undefined,
};

const expenseFormValidationSchema = z.object({
  name: z
    .string()
    .nonempty("Please enter item name")
    .max(30, "Item name must be 30 characters or less"),
  category: z.string().nonempty("Please enter category"),
  amount: z
    .number({
      invalid_type_error: "Please enter a valid amount",
    })
    .min(0.01, "amount should be greater than 0"),
});

type AddExpenseModalProps = {
  editingExpense?: Expense | null;
  setEditingExpense?: Dispatch<SetStateAction<Expense | null>>;
};

export const AddExpenseModal = (props: AddExpenseModalProps) => {
  const { editingExpense, setEditingExpense } = props;

  const toast = useToast({
    isClosable: true,
    duration: 2000,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<CatExpenseFormData>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(expenseFormValidationSchema),
  });

  const onSubmitExpenseForm: SubmitHandler<CatExpenseFormData> = async (
    data
  ) => {
    startTransition(() => {
      const mutation = editingExpense
        ? editExpense(editingExpense.id, data)
        : createExpense(data);
      const successMessage = editingExpense
        ? "Expense updated successfully"
        : "Expense created successfully";

      mutation
        .then((_) => {
          toast({
            title: successMessage,
            status: "success",
          });
          onCloseExpenseModal();
        })
        .catch((error) =>
          toast({
            title: (error as Error).message,
            status: "error",
          })
        );
    });
  };

  const onCloseExpenseModal = () => {
    if (editingExpense) setEditingExpense?.(null);
    onClose();
    reset(defaultValues);
  };

  useEffect(() => {
    if (!editingExpense) return;
    if (!isOpen) onOpen();
    reset(editingExpense);
  }, [editingExpense]);

  return (
    <>
      <Button variant="outline" colorScheme="yellow" onClick={onOpen}>
        Add Expense
      </Button>
      <Modal isOpen={isOpen} size="2xl" onClose={onCloseExpenseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingExpense ? "Edit" : "Add"} Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <form onSubmit={handleSubmit(onSubmitExpenseForm)}>
                <VStack spacing={5}>
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormLabel fontSize="sm" m={1} color="GrayText">
                      Item Name
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
                    <Select
                      placeholder="Select option"
                      {...register("category")}
                    >
                      {Object.values(CatExpenseCategory).map(
                        (category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        )
                      )}
                    </Select>
                    <FormErrorMessage>
                      {errors.category?.message}
                    </FormErrorMessage>
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
                      >
                        $
                      </InputLeftElement>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("amount", {
                          valueAsNumber: true,
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.amount?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <HStack w="full" p={2} justify="flex-end">
                    <Button
                      variant="outline"
                      colorScheme="yellow"
                      mr={3}
                      onClick={onCloseExpenseModal}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      colorScheme="yellow"
                      isDisabled={!isValid}
                      isLoading={isPending}
                    >
                      Submit
                    </Button>
                  </HStack>
                </VStack>
              </form>
              <CatFact isOpen={isOpen} />
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
