import { deleteExpenses } from "@/actions/expenseActions";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  useRef,
  useTransition
} from "react";

type DeleteExpensesProps = {
  selectedExpenseIds: Set<string>;
  setSelectedExpenseIds: Dispatch<SetStateAction<Set<string>>>;
};

export function DeleteExpenses(props: DeleteExpensesProps): JSX.Element {
  const { selectedExpenseIds, setSelectedExpenseIds } = props;

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as any;
  const [isPending, startTransition] = useTransition();

  const handleClickDelete = () => {
    if (selectedExpenseIds?.size) {
      onOpen();
    } else {
      toast({
        title: "Please select expenses to delete.",
      });
    }
  };

  const handleConfirmDeleteExpenses = () => {
    startTransition(() => {
      deleteExpenses(Array.from(selectedExpenseIds))
        .then((_) => {
          toast({
            title: "Expense(s) deleted successfully",
            status: "success",
          });
          setSelectedExpenseIds(new Set());
          onClose();
        })
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
      <Button variant="outline" colorScheme="blue" onClick={handleClickDelete}>
        Delete Expense
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Expenses
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? {selectedExpenseIds?.size} expense(s) will be
              deleted.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                variant="outline"
                colorScheme="red"
                ml={2}
                isLoading={isPending}
                onClick={handleConfirmDeleteExpenses}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
