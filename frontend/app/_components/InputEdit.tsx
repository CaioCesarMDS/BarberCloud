'use client'

import { useState } from 'react'
import { Input } from './shadcn/ui/input'
import { Button } from './shadcn/ui/button'
import { Pencil, Check, X } from 'lucide-react'
import { IMaskInput } from 'react-imask'

interface EditableFieldProps {
    label: string
    value: string
    phone: boolean
    email: boolean
    onSave: (newValue: string) => void
}

export default function EditableField({
    label,
    value,
    phone,
    email,
    onSave,
}: EditableFieldProps) {
    const [editing, setEditing] = useState(false)
    const [tempValue, setTempValue] = useState(value)

    const handleConfirm = () => {
        onSave(tempValue)
        setEditing(false)
    }

    const handleCancel = () => {
        setTempValue(value)
        setEditing(false)
    }

    return (
        <div className="flex items-center gap-4 mb-4">
            <label className="text-sm w-32 text-muted-foreground text-black">{label}</label>
            {phone && (
                <IMaskInput
                    name="phone"
                    label="Phone"
                    mask="+55 00 00000-0000"
                    className={!editing ? "max-w-md hover:not-allowed" : "hover:cursor-text"}
                    disabled={!editing}
                    style={!editing ? { opacity: 0.6 } : {}}
                    readOnly={!editing ? true : false}
                    value={tempValue}
                    onChange={(e) => setTempValue((e.target as HTMLInputElement).value)} />
            )}
            {!phone && (
                <Input
                    className="max-w-md"
                    disabled={!editing}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                />
            )}

            {!editing ? (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(true)}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleConfirm}
                    >
                        <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                    >
                        <X className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            )}
        </div>
    )
}