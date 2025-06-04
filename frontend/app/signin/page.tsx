"use client";

import { zodResolver } from "@hookform/resolvers/zod";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../_components/form/fields/InputField";
import FormWrapper from "../_components/form/FormWrapper";
import Header from "../_components/Header";
=======
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../_components/form/fields/InputField";
import { FormWrapper } from "../_components/form/FormWrapper";
import Header from "../_components/header";
>>>>>>> f76e8fa7dd25aee67496e78e61e613c8bd7cdf8d
import api from "../services/api";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 8 characters." }),
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
      const response = await api.post("/auth/signin", data);
      localStorage.setItem("barber-token", response.data.token);
      console.log("login successfully:", response.data);
      router.push("/home");
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
<<<<<<< HEAD
}
=======
};

export default SignIn;
>>>>>>> f76e8fa7dd25aee67496e78e61e613c8bd7cdf8d
