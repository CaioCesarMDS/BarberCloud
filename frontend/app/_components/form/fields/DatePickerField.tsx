"use client";

import { Popover } from "@headlessui/react";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DatePicker() {
  const [selected, setSelected] = useState<Date>();

  return (
    <Popover className="relative w-full max-w-sm">
      <Popover.Button className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className={selected ? "text-black" : "text-gray-400"}>
          {selected ? selected.toLocaleDateString("pt-BR") : "Selecione uma data"}
        </span>
        <Calendar className="w-5 h-5 text-gray-500" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-md">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          captionLayout="dropdown"
          fromYear={1950}
          toYear={2050}
        />
      </Popover.Panel>
    </Popover>
  );
}
