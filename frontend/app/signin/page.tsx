"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../_components/form/fields/InputField";
import { FormWrapper } from "../_components/form/FormWrapper";
import Header from "../_components/header";
import api from "../services/api";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 8 characters." }),
});

type FormData = z.infer<typeof formSchema>;

const SignIn = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/auth/signin", data);
      if (response.status === 201) {
        console.log("user registered successfully:", response.data);
      } else {
        console.error("Error registering:", response.data);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <main>
      <Header />
      <FormWrapper form={form} onSubmit={onSubmit} submitLabel="Sign In">
        <InputField control={form.control} name="email" label="Email" type="email" />
        <InputField control={form.control} name="password" label="Password" type="password" />
      </FormWrapper>
    </main>
  );
};

export default SignIn;
