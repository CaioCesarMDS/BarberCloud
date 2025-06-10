"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { MaskedInput } from "../../MaskedInput";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../shadcn/ui/form";

interface InputFieldMaskProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  mask: string;
  maskChar?: string | null;
  alwaysShowMask?: boolean;
  placeholder?: string;
  className?: string;
}

export function InputFieldMask<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  mask,
  maskChar = null,
  alwaysShowMask = false,
  placeholder,
  className,
}: InputFieldMaskProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MaskedInput
              type={type}
              mask={mask}
              maskChar={maskChar}
              alwaysShowMask={alwaysShowMask}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
