"use client";

import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import { Button } from "./shadcn/ui/button";
import { Input } from "./shadcn/ui/input";

interface EditableFieldProps {
  label: string;
  value: string;
  phone: boolean;
  email: boolean;
  onSave: (newValue: string) => void;
}

export default function EditableField({ label, value, phone, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleConfirm = () => {
    onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <label className="text-sm w-32 text-muted-foreground text-black">{label}</label>
      {phone && (
        <IMaskInput
          name="phone"
          label="Phone"
          mask="+55 00 00000-0000"
          className={`flex h-9 w-full rounded-md border border-input bg-transparent
                        px-3 py-1 text-base shadow-sm transition-colors file:border-0
                        file:bg-transparent file:text-sm file:font-medium file:text-foreground
                        placeholder:text-muted-foreground focus-visible:outline-none
                        focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed
                        disabled:opacity-50 md:text-sm
                        ${!editing ? "max-w-md hover:not-allowed w-full" : "w-full hover:cursor-text"}`}
          disabled={!editing}
          style={!editing ? { opacity: 0.6 } : {}}
          readOnly={!editing ? true : false}
          value={tempValue}
          onChange={(e) => setTempValue((e.target as HTMLInputElement).value)}
        />
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
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
          <Pencil className="w-4 h-4" />
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleConfirm}>
            <Check className="w-4 h-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )}
    </div>
  );
}
