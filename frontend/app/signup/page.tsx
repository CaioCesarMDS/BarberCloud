"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from "../_components/header";
import { Button } from "../_components/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../_components/shadcn/ui/form";
import { Input } from "../_components/shadcn/ui/input";
import api from "../services/api";

const roles = ["ADMIN", "BARBER", "CLIENT"] as const;
const RoleEnum = z.enum(roles);

const formSchema = z
  .object({
    name: z.string().min(4, { message: "Name must be at least 4 characters." }),
    phone: z.string().min(10, { message: "Phone must be at least 10 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    birth: z.coerce.date({
      errorMap: () => ({ message: "Invalid date format" }),
    }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters." }),
    role: RoleEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const SignUp = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      birth: undefined,
      password: "",
      confirmPassword: "",
      role: "CLIENT",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userData = { ...data, confirmPassword: undefined };
      const response = await api.post("/auth/signup", userData);
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
    <div>
      <Header />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center min-h-screen"
        >
          <div className="w-10/12 max-w-md space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="birth"
              render={({ field }) => {
                // converte Date para string YYYY-MM-DD para o input
                const value =
                  field.value instanceof Date
                    ? field.value.toISOString().substring(0, 10)
                    : field.value || "";

                return (
                  <FormItem>
                    <FormLabel>Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={value}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full border px-2 py-1 rounded">
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
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

export default SignUp;
