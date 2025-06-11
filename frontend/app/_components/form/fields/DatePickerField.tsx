import { Popover } from "@headlessui/react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "../../../_lib/utils";
import { Button } from "../../shadcn/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../shadcn/ui/form";

interface DatePickerFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export default function DatePickerField<T extends FieldValues>({ control, name, label }: DatePickerFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover className="relative">
            <FormControl>
              <Popover.Button
                as={Button}
                variant="outline"
                className={cn("w-full justify-between text-left font-normal", !field.value && "text-muted-foreground")}
              >
                {field.value ? new Date(field.value).toLocaleDateString("pt-BR") : "Selecione uma data"}
                <Calendar className="ml-2 h-4 w-4 opacity-50" />
              </Popover.Button>
            </FormControl>
            <Popover.Panel className="absolute z-10 mt-2 w-[320px] bg-white border border-gray-300 rounded-md shadow-md">
              <DayPicker
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                captionLayout="dropdown"
                fromYear={1950}
                toYear={2050}
              />
            </Popover.Panel>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
