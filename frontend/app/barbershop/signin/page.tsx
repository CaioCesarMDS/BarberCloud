"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import InputField from "../../_components/form/fields/InputField";
import FormWrapper from "../../_components/form/FormWrapper";
import Header from "../../_components/Header";
import { api } from "../../_services/api";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function SignIn() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/auth/employee/signin", data);
      localStorage.setItem("barber-token", response.data.token);
      console.log("login successfully:", response.data);
      router.push("/barbershop/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during registration:", error);
        if (error.status === 401 || error.status === 400) {
          toast("Usuário e/ou senha Incorretos!");
        }
      }
    }
  };

  return (
    <main>
      <Header />
      <Toaster />
      <FormWrapper form={form} onSubmit={onSubmit} submitLabel="Sign In">
        <InputField control={form.control} name="email" label="Email" type="email" />
        <InputField control={form.control} name="password" label="Password" type="password" />
        <Link href="/barbershop/forgot-password">
          <p className="text-blue-500 underline mt-1">Esqueci minha senha?</p>
        </Link>
      </FormWrapper>
    </main>
  );
}
