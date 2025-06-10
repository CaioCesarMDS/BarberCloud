"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../../_components/form/fields/InputField";
import FormWrapper from "../../_components/form/FormWrapper";
import Header from "../../_components/header";
import api from "../../services/api";
import Link from "next/link";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/app/_components/shadcn/ui/input-otp";

const formEmailSchema = z.object({
    email: z.string().email("Email inválido").min(6, { message: "Email muito curto" }),
});

const formCodeSchema = z.object({
    code: z.string().min(6, { message: "Verfication code must be a 6 characters" }),
});

type FormEmailData = z.infer<typeof formEmailSchema>;
type FormCodeData = z.infer<typeof formCodeSchema>;

export default function SignIn() {
    const router = useRouter();
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(true);

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

    const onSubmitEmail = async (data: FormEmailData) => {
        try {
            console.log("envie para: ", data.email);
            // Aqui você pode chamar sua API que envia o código
            setShowEmailForm(false);
            setShowCodeForm(true); // <- MOSTRA O FORMULÁRIO DO CÓDIGO
        } catch (error) {
            console.error("Erro ao enviar email:", error);
        }
    };

    const onSubmitCode = async (data: FormCodeData) => {
        try {
            console.log("código: ", data.code);
            // Aqui você pode chamar sua API para validar o código
        } catch (error) {
            console.error("Erro ao validar código:", error);
        }
    };

    return (
        <main>
            <Header />

            {showEmailForm && (
                <FormWrapper form={formEmail} onSubmit={onSubmitEmail} submitLabel="Send email">
                    <InputField control={formEmail.control} name="email" label="Email" type="email" />
                </FormWrapper>
            )}

            {showCodeForm && (
                <FormWrapper form={formCode} onSubmit={onSubmitCode} submitLabel="Change Password">
                    <InputOTP maxLength={6} name="code" aria-label="CODE">
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
                </FormWrapper>
            )}
        </main>
    );
}
