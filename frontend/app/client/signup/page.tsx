"use client";

import { MaskedInputField } from "@/app/_components/MaskedInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import DatePickerField from "../../_components/form/fields/DatePickerField";
import InputField from "../../_components/form/fields/InputField";
import FormWrapper from "../../_components/form/FormWrapper";
import Header from "../../_components/header";
import { api } from "../../_services/api";

const formSchema = z
  .object({
    name: z.string().min(4, { message: "Name must be at least 4 characters." }),
    phone: z
      .string()
      .min(10, { message: "Phone must be at least 10 characters." })
      .max(17, { message: "phone must have a maximum of 17 characters." })
      .trim(),
    birth: z.date({ message: "Invalid date." }),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function SignUp() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birth: undefined,
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userData = {
        ...data,
        birth: data.birth.toISOString(),
        confirmPassword: undefined,
        phone: data.phone.replace(/\D/g, ""),
      };

      console.log("phone", userData.phone);

      const response = await api.post("/auth/client/signup", userData);
      if (response.status === 201) {
        console.log("User signed up successfully:", response.data);
        router.push("/client/signin");
      } else {
        console.error("Error signing up:", response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during registration:", error);
        if (error.status === 400) {
          toast("Erro ao criar conta!");
        }
      }
    }
  };

  return (
    <main>
      <Header />
      <Toaster />
      <FormWrapper form={form} onSubmit={onSubmit} submitLabel="Sign Up">
        <InputField control={form.control} name="name" label="Name" type="text" />
        <MaskedInputField control={form.control} name="phone" label="Phone" mask="+55 00 00000-0000" />
        <DatePickerField control={form.control} name="birth" label="Birth Date" />
        <InputField control={form.control} name="email" label="Email" type="email" />
        <InputField control={form.control} name="password" label="Password" type="password" />
        <InputField control={form.control} name="confirmPassword" label="Confirm Password" type="password" />
      </FormWrapper>
    </main>
  );
}
