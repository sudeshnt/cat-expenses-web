"use client";
import * as z from "zod";

import { createExpense, editExpense } from "@/actions/expenseActions";
import {
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useTransition,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CatExpenseFormData, type Expense } from "../types";
import { CatFact } from "./CatFact";
import { ExpenseForm } from "./ExpenseForm";

const expenseFormValidationSchema = z.object({
  name: z.string().nonempty("Please enter item name"),
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

  const { register, handleSubmit, reset, formState } =
    useForm<CatExpenseFormData>({
      mode: "onChange",
      resolver: zodResolver(expenseFormValidationSchema),
    });

  const onSubmitExpenseForm: SubmitHandler<CatExpenseFormData> = async (
    data
  ) => {
    startTransition(() => {
      const mutation = editingExpense
        ? editExpense(editingExpense.id, data)
        : createExpense(data);
      mutation
        .then((_) => {
          toast({
            title: "Expense created successfully",
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
    reset();
    onClose();
  };

  useEffect(() => {
    if (!editingExpense) return;
    if (!isOpen) onOpen();
    reset(editingExpense);
  }, [isOpen, editingExpense, onOpen, reset]);

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
              <ExpenseForm
                isLoading={isPending}
                formState={formState}
                register={register}
                onClose={onCloseExpenseModal}
                onSubmit={handleSubmit(onSubmitExpenseForm)}
              />
              <Suspense fallback="loading">
                <CatFact isOpen={isOpen} />
              </Suspense>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
