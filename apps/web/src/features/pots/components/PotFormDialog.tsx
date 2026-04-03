import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";

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

import type { Pot } from "@finance/shared";

const POT_NAME_MAX_LENGTH = 30;

const THEME_COLORS = [
  { name: "Green", value: "#277c78" },
  { name: "Yellow", value: "#f2cdac" },
  { name: "Cyan", value: "#82c9d7" },
  { name: "Navy", value: "#626070" },
  { name: "Red", value: "#c94736" },
  { name: "Purple", value: "#826cb0" },
  { name: "Turquoise", value: "#597c7c" },
  { name: "Brown", value: "#93674f" },
  { name: "Magenta", value: "#934f6f" },
  { name: "Blue", value: "#3f82b2" },
  { name: "Grey", value: "#97a0ac" },
  { name: "Army", value: "#7f9161" },
  { name: "Pink", value: "#af81ba" },
  { name: "Gold", value: "#cab361" },
  { name: "Orange", value: "#be6c49" },
] as const;

interface PotFormDialogProps {
  usedThemes: string[];
  pot?: Pot;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PotFormDialog({
  usedThemes,
  pot,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PotFormDialogProps) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isEditing = !!pot;
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const normalizedUsedThemes = usedThemes.map((t) => t.toLowerCase());

  const form = useForm({
    defaultValues: {
      name: pot?.name ?? "",
      target: pot?.target ?? "",
      theme: pot?.theme ?? THEME_COLORS[0].value,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true);
      try {
        if (isEditing) {
          await api.patch(`/pots/${pot.id}`, value);
        } else {
          await api.post("/pots", value);
        }
        onOpenChange(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["pots"] });
        queryClient.invalidateQueries({ queryKey: ["overview"] });
      } finally {
        setIsPending(false);
      }
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: pot?.name ?? "",
        target: pot?.target ?? "",
        theme: pot?.theme ?? THEME_COLORS[0].value,
      });
    }
  }, [open, pot]);

  const dialog = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Pot" : "Add New Pot"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "If your saving targets change, feel free to update your pots."
            : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-4">
          <form.Field
            name="name"
            children={(field) => {
              const charsLeft =
                POT_NAME_MAX_LENGTH - (field.state.value?.length ?? 0);
              return (
                <div className="flex flex-col gap-1">
                  <Label htmlFor={field.name}>Pot Name</Label>
                  <Input
                    id={field.name}
                    placeholder="e.g. Rainy Days"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    maxLength={POT_NAME_MAX_LENGTH}
                  />
                  <p className="text-grey-500 text-right text-xs">
                    {charsLeft} characters left
                  </p>
                </div>
              );
            }}
          />

          <form.Field
            name="target"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Target</Label>
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
                  />
                </div>
              </div>
            )}
          />

          <form.Field
            name="theme"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label>Theme</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <span
                        className="size-4 shrink-0 rounded-full"
                        style={{ background: field.state.value }}
                      />
                      {THEME_COLORS.find(
                        (c) =>
                          c.value.toLowerCase() ===
                          field.state.value.toLowerCase(),
                      )?.name ?? "Select a color"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_COLORS.map((color) => {
                      const isUsed =
                        normalizedUsedThemes.includes(
                          color.value.toLowerCase(),
                        ) &&
                        color.value.toLowerCase() !==
                          pot?.theme?.toLowerCase();
                      return (
                        <SelectItem
                          key={color.value}
                          value={color.value}
                          disabled={isUsed}
                        >
                          <span
                            className="size-4 shrink-0 rounded-full"
                            style={{ background: color.value }}
                          />
                          <span className="flex-1">{color.name}</span>
                          {isUsed && (
                            <span className="text-grey-500 text-xs">
                              Already used
                            </span>
                          )}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
            {isPending
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save Changes"
                : "Add Pot"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialog}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Add New Pot</Button>
      </DialogTrigger>
      {dialog}
    </Dialog>
  );
}
