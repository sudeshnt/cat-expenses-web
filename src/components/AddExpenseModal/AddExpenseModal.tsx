"use client";
import * as z from "zod";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { createExpense } from "@/actions/expenseActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TypeAnimation } from "react-type-animation";
import { CatExpenseCategory, CatExpenseFormData } from "./types";

const expenseFormValidationSchema = z.object({
  name: z.string().nonempty("Please enter item name"),
  category: z.string().nonempty("Please enter category"),
  amount: z
    .number({
      invalid_type_error: "Please enter a valid amount",
    })
    .min(0),
});

export const AddExpenseModal = () => {
  const toast = useToast({
    isClosable: true,
    duration: 2000,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending, startTransition] = useTransition();

  const [catFact, setCatFact] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, errors },
  } = useForm<CatExpenseFormData>({
    mode: "onChange",
    resolver: zodResolver(expenseFormValidationSchema),
  });

  const onSubmitExpenseForm: SubmitHandler<CatExpenseFormData> = async (
    data
  ) => {
    startTransition(() => {
      createExpense(data)
        .then((_) => {
          toast({
            title: "Expense created successfully",
            status: "success",
          });
          onCloseExpenseForm();
        })
        .catch((error) =>
          toast({
            title: (error as Error).message,
            status: "error",
          })
        );
    });
  };

  const onOpenExpenseModal = () => {
    onOpen();
    fetch("https://catfact.ninja/fact", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setCatFact(responseJson.fact);
      });
  };

  const onCloseExpenseForm = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Button variant="outline" colorScheme="blue" onClick={onOpenExpenseModal}>
        Add Expense
      </Button>
      <Modal isOpen={isOpen} size="2xl" onClose={onCloseExpenseForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <form onSubmit={handleSubmit(onSubmitExpenseForm)}>
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
                    <Input
                      type="number"
                      {...register("amount", {
                        valueAsNumber: true,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.amount?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <HStack w="full" p={2} justify="flex-end">
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      mr={3}
                      onClick={onCloseExpenseForm}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      colorScheme="blue"
                      isDisabled={!isValid}
                      isLoading={isPending}
                    >
                      Submit
                    </Button>
                  </HStack>
                </VStack>
              </form>
              <Stack>
                <Text as="samp" fontSize="md" color="blue.600" my={2}>
                  Random cat Fact:
                </Text>
                <Box>
                  <TypeAnimation
                    sequence={[catFact]}
                    wrapper="span"
                    speed={55}
                    style={{
                      fontSize: "15px",
                      display: "inline-block",
                      fontStyle: "italic",
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
