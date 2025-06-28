'use client'

import { Input } from './shadcn/ui/input'
import { Button } from './shadcn/ui/button'
import { Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './shadcn/ui/dialog'
import FormWrapper from './form/FormWrapper'
import InputField from './form/fields/InputField'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type FormPasswordData = z.infer<typeof formPasswordSchema>;

interface InputEditPasswordProps {
    label: string
    onSubmitPassword: (data: FormPasswordData) => Promise<void>
}

export default function InputEditPassword({ label, onSubmitPassword }: InputEditPasswordProps) {
    const [showDialog, setShowDialog] = useState(false);

    const formPassword = useForm<FormPasswordData>({
        resolver: zodResolver(formPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const execAndCloseDialog = (data: FormPasswordData) => {
        setShowDialog(false);
        onSubmitPassword(data);
    }

    return (
        <div className="flex items-center gap-4 mb-4">
            <label className="text-sm w-32 text-muted-foreground text-black">{label}</label>
            <Input
                className="max-w-md"
                disabled={true}
                value='********'
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDialog(true)}
            >
                <Pencil className="w-4 h-4" />
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Troque sua senha</DialogTitle>
                        <DialogDescription>Defina uma nova senha segura.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <FormWrapper
                            form={formPassword}
                            onSubmit={execAndCloseDialog}
                            submitLabel="Change Password"
                            stylePlus='pt-2'
                        >
                            <div className="flex flex-col gap-4">
                                <InputField
                                    control={formPassword.control}
                                    name="password"
                                    label="Password"
                                    type="password"
                                />
                                <InputField
                                    control={formPassword.control}
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                />
                            </div>
                        </FormWrapper>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}