"use client";

import { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "../shadcn/ui/button";
import { Form } from "../shadcn/ui/form";

interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  stylePlus?: string;
  children: React.ReactNode;
  submitLabel?: string;
}

export default function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  children,
  stylePlus,
  submitLabel = "Submit",
}: FormWrapperProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`flex flex-col items-center justify-center  ${stylePlus ? stylePlus : 'min-h-screen'}`}>
        <div className="w-10/12 max-w-md space-y-4">{children}</div>
        <Button type="submit" className="mt-6 mx-auto w-1/3">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
