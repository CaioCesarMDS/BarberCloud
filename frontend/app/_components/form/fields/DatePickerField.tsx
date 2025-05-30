import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Button } from "../../shadcn/ui/button";
import { Calendar } from "../../shadcn/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../shadcn/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/ui/popover";

interface DatePickerFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export const DatePickerField = <T extends FieldValues>({ control, name, label }: DatePickerFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant={"outline"} className={"pl-3 text-left font-normal"}>
                  {field.value ? format(field.value, "dd 'de' MMM 'de' yyyy", { locale: ptBR }) : <span></span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
