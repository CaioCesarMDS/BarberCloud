// app/barbershop/[id]/page.tsx
"use client";

import Header from "@/app/_components/Headerr";
import { Button } from "@/app/_components/shadcn/ui/button";
import { Calendar } from "@/app/_components/shadcn/ui/calendar";
import { api } from "@/app/_services/api";
import { Barbershop } from "@/app/_types/barbeshop";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "./__helpers/hours";

interface BarbershopProfileProps {
  params: Promise<{ id: string }>;
}

export default function BarbershopProfile(props: BarbershopProfileProps) {
  const { id } = use(props.params);
  const [hour, setHour] = useState<string | undefined>("");

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const router = useRouter();

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

  useEffect(() => {
    const fetchBarbershop = async () => {
      try {
        const { data } = await api.get(`/barbershop/${id}`);
        setBarbershop(data);
      } catch (error) {
        console.error("Erro ao buscar barbearia:", error);
        router.push("/not-found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbershop();
  }, [id, router]);

  if (isLoading) return <p className="p-6 text-muted-foreground">Carregando barbearia...</p>;
  if (!barbershop) return null;

  const handleHourClick = (time: string) => {
    setHour(time);
  };

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour("");
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{barbershop.name}</h1>
        <div className="relative w-full h-64 mb-6">
          <Image
            src={barbershop.imageUrl}
            alt={`Imagem da barbearia ${barbershop.name}`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <p className="text-muted-foreground mb-2">
          Horário de funcionamento: {barbershop.timeOpen} – {barbershop.timeClose}
        </p>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h1 className="text-2xl font-bold pb-12">Agendamento</h1>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateClick}
            className="w-full rounded-lg border mb-"
            locale={ptBR}
            hidden={{ before: new Date() }}
            styles={{
              head_cell: {
                width: "100%",
              },
              cell: {
                width: "100%",
              },
              button: {
                width: "100%",
              },
              nav_button_previous: {
                width: "fit-content",
              },
              nav_button_next: {
                width: "fit-content",
              },
            }}
          />
          {date && (
            <div className="flex flex-wrap gap-4 items-start justify-center py-6 px-5">
              {timeList.map((time) => (
                <Button
                  onClick={() => handleHourClick(time)}
                  variant={hour === time ? "default" : "outline"}
                  className="rounded-full text-sm h-10 lg:w-36 lg:h-16 min-w-[80px] text-center"
                  key={time}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
