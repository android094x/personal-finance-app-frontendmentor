import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

import { CreateTransactionSchema, type Category } from "@finance/shared";

interface TxsCreateModalProps {
  categories: Pick<Category, "id" | "name">[];
}

export function TxsCreateModal({ categories }: TxsCreateModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      amount: "",
      categoryId: "",
      date: new Date(),
      avatar: null,
      recurring: false,
    },
    onSubmit: async ({ value }) => {
      try {
        await api.post("/transactions", value);
        setOpen(false);
        form.reset();
        router.invalidate();
      } finally {
        setIsPending(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add New Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to keep track of your spending and income.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsPending(true);
            form.handleSubmit();
          }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <form.Field
              name="name"
              validators={{
                onChange: CreateTransactionSchema.shape.name,
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor={field.name}>Transaction Name</Label>
                  <Input
                    id={field.name}
                    placeholder="e.g. Urban Services Hub"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errorMap["onChange"]
                        ? true
                        : undefined
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errorMap["onChange"] && (
                      <p className="text-red text-xs">
                        {typeof field.state.meta.errorMap["onChange"] ===
                        "string"
                          ? field.state.meta.errorMap["onChange"]
                          : field.state.meta.errorMap["onChange"]?.[0]?.message}
                      </p>
                    )}
                </div>
              )}
            />

            <form.Field
              name="categoryId"
              validators={{
                onChange: CreateTransactionSchema.shape.categoryId,
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Category</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger
                      aria-invalid={
                        field.state.meta.isTouched &&
                        field.state.meta.errorMap["onChange"]
                          ? true
                          : undefined
                      }
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched &&
                    field.state.meta.errorMap["onChange"] && (
                      <p className="text-red text-xs">
                        {typeof field.state.meta.errorMap["onChange"] ===
                        "string"
                          ? field.state.meta.errorMap["onChange"]
                          : field.state.meta.errorMap["onChange"]?.[0]?.message}
                      </p>
                    )}
                </div>
              )}
            />

            <form.Field
              name="amount"
              validators={{
                onChange: CreateTransactionSchema.shape.amount,
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor={field.name}>Amount</Label>
                  <div className="relative">
                    <span className="text-beige-500 absolute top-1/2 left-5 -translate-y-1/2 text-sm">
                      $
                    </span>
                    <Input
                      id={field.name}
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2000"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="pl-9"
                      aria-invalid={
                        field.state.meta.isTouched &&
                        field.state.meta.errorMap["onChange"]
                          ? true
                          : undefined
                      }
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errorMap["onChange"] && (
                      <p className="text-red text-xs">
                        {typeof field.state.meta.errorMap["onChange"] ===
                        "string"
                          ? field.state.meta.errorMap["onChange"]
                          : field.state.meta.errorMap["onChange"]?.[0]?.message}
                      </p>
                    )}
                </div>
              )}
            />

            <form.Field
              name="date"
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <Label>Transaction Date</Label>
                  <DatePicker
                    value={
                      field.state.value instanceof Date
                        ? field.state.value
                        : undefined
                    }
                    onChange={(date) => {
                      if (date) field.handleChange(date);
                    }}
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errorMap["onChange"]
                        ? true
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="recurring"
              children={(field) => (
                <div className="flex items-center gap-3">
                  <input
                    id={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="accent-grey-900 size-4"
                  />
                  <Label htmlFor={field.name}>Recurring transaction</Label>
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!form.state.canSubmit || isPending}
              className="w-full"
            >
              {isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
