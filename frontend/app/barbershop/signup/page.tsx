"use client";

import DatePickerField from "@/app/_components/form/fields/DatePickerField";
import { MaskedInputField } from "@/app/_components/MaskedInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../../_components/form/fields/InputField";
import FormWrapper from "../../_components/form/FormWrapper";
import Header from "../../_components/Header";
import api from "../../services/api";

import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters." })
      .max(100, { message: "name must have a maximum of 100 characters." }),
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
      .trim()
      .max(64, { message: "password must have a maximum of 64 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters." })
      .max(64, { message: "confirm password must have a maximum of 64 characters." }),
    role: z.enum(["ADMIN"]),
    barbershopName: z
      .string()
      .min(4, { message: "Barbershop Name must be at least 4 characters." })
      .max(100, { message: "Barbershop name must have a maximum of 100 characters." }),
    photoBarbershop: z.string(),
    timeOpen: z.string().regex(/^\d{2}:\d{2}$/),
    timeClose: z.string().regex(/^\d{2}:\d{2}$/),
    numberAddress: z.string().nonempty(),
    street: z.string().nonempty(),
    complement: z.string().nonempty(),
    neighborhood: z.string().nonempty(),
    city: z.string().nonempty(),
    state: z.string().nonempty(),
    country: z.string().nonempty(),
    zipcode: z.string().nonempty(),
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
      role: "ADMIN",
      barbershopName: "",
      photoBarbershop: "",
      timeOpen: "07:00",
      timeClose: "19:00",
      numberAddress: "",
      street: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const barbershopData = {
        name: data.barbershopName,
        imageUrl: "x",
        timeOpen: data.timeOpen,
        timeClose: data.timeClose,
        number: data.numberAddress,
        street: data.street,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipcode,
      };

      // colocar logica para pegar arquivo do input aceitar apenas png jpeg e colocar no buckets3

      const responseBarbershop = await api.post("/barbershop/create", barbershopData);
      if (responseBarbershop.status === 201) {
        console.log("Barbershop Registred successfully:", responseBarbershop.data);

        const userData = {
          name: data.name,
          phone: "+" + data.phone.replace(/\D/g, ""),
          birth: data.birth.toISOString(),
          email: data.email,
          password: data.password,
          role: "ADMIN",
          barbershopId: responseBarbershop.data.id,
        };

        console.log("User Data:", userData.phone);

        const responseUser = await api.post("/auth/employee/signup", userData);

        if (responseUser.status === 201) {
          console.log("User signed up successfully:", responseUser.data);
          router.push("/barbershop/signin");
        } else {
          console.error("Error signing up:", responseUser.data);
        }
      } else {
        console.error("Error to register Barbershop:", responseBarbershop.data);
      }
    } catch (error) {
      console.error("Error during requests:", error);
    }
  };

  //verificação do form
  //console.log(form.formState.errors);

  return (
    <main>
      <Header />
      <FormWrapper form={form} onSubmit={onSubmit} submitLabel="Sign Up">
        <h3 className="p-6">Sign Up</h3>

        <InputField control={form.control} name="name" label="Name" type="text" />
        <MaskedInputField control={form.control} name="phone" label="Phone" mask="+55 00 00000-0000" />
        <InputField control={form.control} name="email" label="Email" type="email" />
        <DatePickerField control={form.control} name="birth" label="Birth Date" />
        <InputField control={form.control} name="password" label="Password" type="password" />
        <InputField control={form.control} name="confirmPassword" label="Confirm Password" type="password" />

        <h3 className="p-6">Register your Barbershop</h3>

        <InputField control={form.control} name="barbershopName" label="Barbershop Name" type="text" />

        <InputField control={form.control} name="photoBarbershop" label="Barbershop Photo" type="file" />

        <InputField control={form.control} name="timeOpen" label="Time to Open" type="time" />
        <InputField control={form.control} name="timeClose" label="Time to Close" type="time" />

        <InputField control={form.control} name="numberAddress" label="Number" type="text" />
        <InputField control={form.control} name="street" label="Street" type="text" />
        <InputField control={form.control} name="complement" label="Complement" type="text" />
        <InputField control={form.control} name="neighborhood" label="Neighborhood" type="text" />
        <InputField control={form.control} name="city" label="City" type="text" />
        <InputField control={form.control} name="state" label="State" type="text" />
        <InputField control={form.control} name="country" label="Country" type="text" />
        <InputField control={form.control} name="zipcode" label="Zip-Code" />
      </FormWrapper>
    </main>
  );
}
