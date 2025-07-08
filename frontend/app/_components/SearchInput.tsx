"use client";

import { Search } from "lucide-react";
import { Input } from "./shadcn/ui/input";

export function SearchInput({
  placeholder = "Pesquisar...",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="text" placeholder={placeholder} value={value} onChange={onChange} className="pl-9" />
    </div>
  );
}
