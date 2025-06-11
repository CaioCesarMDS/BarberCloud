import { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./shadcn/ui/form";

type MaskedInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  mask: string;
};

export function MaskedInputField<T extends FieldValues>({ control, name, label, mask }: MaskedInputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, Path<T>> }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <IMaskInput
              {...field}
              mask={mask}
              className="input peer block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onAccept={(value: string) => field.onChange(value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
