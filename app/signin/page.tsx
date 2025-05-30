"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from "../_components/header";
import { Button } from "../_components/shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../_components/shadcn/ui/form";
import { Input } from "../_components/shadcn/ui/input";
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
        console.log("Login successful: ", response.data);
      } else {
        console.error("Unexpected server response: ", response.data);
      }
    } catch (error) {
      console.error("Unexpected error during login: ", error);
    }
  };

  return (
    <div>
      <Header />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-10/12 max-w-md space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="mt-6 mx-auto w-1/3">
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
