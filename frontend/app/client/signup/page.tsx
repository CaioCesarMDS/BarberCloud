"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DatePickerField from "../../_components/form/fields/DatePickerField";
import InputField from "../../_components/form/fields/InputField";
import FormWrapper from "../../_components/form/FormWrapper";
import Header from "../../_components/Header";
import api from "../../services/api";

const formSchema = z
  .object({
    name: z.string().min(4, { message: "Name must be at least 4 characters." }),
    birthDate: z.date({ message: "Invalid date." }),
    phone: z.string().min(10, { message: "Phone must be at least 10 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-z]/, { message: "Contains at least one lowercase letter." })
      .regex(/[A-Z]/, { message: "Contains at least one uppercase letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters." }),
    role: z.enum(["CLIENT"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function SignUp() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: undefined,
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CLIENT",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userData = { ...data, confirmPassword: undefined };

      const response = await api.post("/auth/client/signup", userData);
      if (response.status === 201) {
        console.log("User signed up successfully:", response.data);
      } else {
        console.error("Error signing up:", response.data);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <main>
      <Header />
      <FormWrapper form={form} onSubmit={onSubmit} submitLabel="Sign Up">
        <InputField control={form.control} name="name" label="Name" type="text" />
        <InputField control={form.control} name="phone" label="Phone" type="tel" />
        <InputField control={form.control} name="email" label="Email" type="email" />

        <DatePickerField control={form.control} name="birthDate" label="Date Of Birth" />

        <InputField control={form.control} name="password" label="Password" type="password" />
        <InputField control={form.control} name="confirmPassword" label="Confirm Password" type="password" />
      </FormWrapper>
    </main>
  );
}
