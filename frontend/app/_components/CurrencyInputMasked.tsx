import CurrencyInput from "react-currency-input-field"
import { Control, FieldValues, Path } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./shadcn/ui/form"

type CurrencyInputMaskedProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
}

export function CurrencyInputMasked<T extends FieldValues>({
  control,
  name,
  label,
}: CurrencyInputMaskedProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <CurrencyInput
              id={name}
              name={field.name}
              value={field.value}
              decimalsLimit={2}
              decimalSeparator=","
              groupSeparator="."
              prefix="R$"
              intlConfig={{ locale: "pt-BR", currency: "BRL" }}
              onValueChange={(value) => {
                field.onChange(value ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : 0)
              }}
              className="peer block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="R$ 0,00"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}