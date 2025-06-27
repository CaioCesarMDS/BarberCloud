"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../../_components/form/fields/InputField";
import FormWrapper from "../../_components/form/FormWrapper";
import Header from "../../_components/Header";
import { api, updatePassword } from "../../services/api";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/app/_components/shadcn/ui/input-otp";
import { toast, Toaster } from "sonner";
import { AxiosError } from "axios";

const formEmailSchema = z.object({
    email: z.string().email("Invalid Email").min(6, { message: "Email can`t be a short" }),
});

const formCodeSchema = z.object({
    code: z.string().min(6, { message: "Verfication code must be a 6 characters" }),
});

const formPasswordSchema = z.object({
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
    confirmPassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters." })
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormEmailData = z.infer<typeof formEmailSchema>;
type FormCodeData = z.infer<typeof formCodeSchema>;
type FormPasswordData = z.infer<typeof formPasswordSchema>;

export default function SignIn() {
    const router = useRouter();
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [clientEmail, setClientEmail] = useState<string>('');

    const formEmail = useForm<FormEmailData>({
        resolver: zodResolver(formEmailSchema),
        defaultValues: {
            email: "",
        },
    });

    const formCode = useForm<FormCodeData>({
        resolver: zodResolver(formCodeSchema),
        defaultValues: {
            code: "",
        },
    });

    const formPassword = useForm<FormPasswordData>({
        resolver: zodResolver(formPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmitEmail = async (data: FormEmailData) => {
        try {
            const response = await api.get(`/auth/forgot-password?email=${data.email}`);
            if (response.status === 200) {
                setShowEmailForm(false);
                setShowCodeForm(true);
                setShowPasswordForm(false);
                setClientEmail(data.email);
                console.log(clientEmail)
                toast('Verify the code in your email!')
            } else {
                toast(
                    'The email was sent is invalid!',
                    {
                        description: 'Send a valid email.',
                        action: {
                            label: 'Ok',
                            onClick: () => console.log('send a valid email.')
                        }
                    });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast(
                    'The email was sent is invalid!',
                    {
                        description: error?.message,
                        action: {
                            label: 'Ok',
                            onClick: () => console.log('send a valid email.')
                        }
                    });
            }
        }
    };

    const onSubmitCode = async (data: FormCodeData) => {
        try {
            const response = await api.get(`/auth/forgot-password/reset?email=${clientEmail}&code=${data.code}`);
            if (response.status === 200) {
                setShowEmailForm(false);
                setShowCodeForm(false);
                setShowPasswordForm(true);
                toast('Change your password!')
            } else {
                toast(
                    'The code was sent is invalid!',
                    {
                        description: 'Send a valid code.',
                        action: {
                            label: 'Ok',
                            onClick: () => console.log('send a valid code.')
                        }
                    });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast(
                    'The code was sent is invalid!',
                    {
                        description: error?.message,
                        action: {
                            label: 'Ok',
                            onClick: () => console.log(error)
                        }
                    });
            }
        }
    };

    const onSubmitPassword = async (data: FormPasswordData) => {
        try {
            const responseGet = await api.get(`/employee?email=${clientEmail}`);
            if (responseGet.status === 200) {
                const responseUpdate = await updatePassword.put(`/employee/${responseGet.data.id}`,
                    {
                        password: data.password
                    }
                )
                if (responseUpdate.status === 200) {
                    console.log(responseUpdate)
                    toast('Password was changed!')
                    router.push('/barbershop/signin')
                }
            } else {
                toast(
                    'The email was sent is invalid!',
                    {
                        description: 'Send a valid email.',
                        action: {
                            label: 'Ok',
                            onClick: () => console.log('send a valid email.')
                        }
                    });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast(
                    'error in update password!',
                    {
                        description: error?.message,
                        action: {
                            label: 'Ok',
                            onClick: () => console.log(error)
                        }
                    });
            }
        }
    };

    return (
        <main>
            <Header />
            <Toaster />

            {showEmailForm && (
                <FormWrapper form={formEmail} onSubmit={onSubmitEmail} submitLabel="Send email">
                    <InputField control={formEmail.control} name="email" label="Email" type="email" />
                </FormWrapper>
            )}

            {showCodeForm && (
                <FormWrapper form={formCode} onSubmit={onSubmitCode} submitLabel="Change Password">
                    <Controller
                        control={formCode.control}
                        name="code"
                        render={({ field }) => (
                            <InputOTP maxLength={6} {...field} value={field.value || ""}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />
                </FormWrapper>
            )}

            {showPasswordForm && (
                <FormWrapper form={formPassword} onSubmit={onSubmitPassword} submitLabel="Change Password">
                    <InputField control={formPassword.control} name="password" label="Password" type="password" />
                    <InputField control={formPassword.control} name="confirmPassword" label="Confirm Password" type="password" />
                </FormWrapper>
            )}
        </main>
    );
}
