"use client";

import ClientSidebar from "@/app/_components/ClientSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";
import { Avatar, AvatarFallback } from "@/app/_components/shadcn/ui/avatar";
import { Button } from "@/app/_components/shadcn/ui/button";
import { Calendar } from "@/app/_components/shadcn/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/shadcn/ui/card";
import { api } from "@/app/_services/api";
import { Barber } from "@/app/_types/barber";
import { Barbershop } from "@/app/_types/barbershop";
import ClientDetails from "@/app/_types/clientDetails";
import Service from "@/app/_types/services";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { generateDayTimeList } from "./__helpers/hours";

interface BarbershopProfileProps {
  params: Promise<{ id: string }>;
}

export default function BarbershopProfile({ params }: BarbershopProfileProps) {
  const { id } = use(params);
  const router = useRouter();

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [barbers, setBarbers] = useState<Barber[] | null>([]);
  const [services, setServices] = useState<Service[] | null>([]);
  const [client, setClient] = useState<ClientDetails | null>(null);

  const [selectedBarber, setSelectedBarber] = useState<string>();
  const [selectedServices, setSelectedServices] = useState<number[] | null>(null);

  const [hour, setHour] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const timeList = useMemo(() => generateDayTimeList(date), [date]);

  useEffect(() => {
    const token = localStorage.getItem("barber-token");
    if (!token) {
      router.push("/client/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const [barbershopRes, barbersRes, servicesRes, authRes] = await Promise.all([
          api.get(`/barbershop/${id}`),
          api.get(`/employee/search/all/${id}`),
          api.get(`/services/search/all/${id}`),
          api.get("auth/me"),
        ]);

        setBarbershop(barbershopRes.data);
        setBarbers(barbersRes.data);
        setServices(servicesRes.data);
        setClient(authRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) =>
      (prev ?? []).includes(serviceId) ? (prev ?? []).filter((id) => id !== serviceId) : [...(prev ?? []), serviceId]
    );
  };

  const handleScheduling = async () => {
    if (!selectedBarber || !selectedServices || !hour || !date || !client || !barbershop) {
      toast.error("Preencha todos os dados antes de agendar.");
      return;
    }

    try {
      const servicePrices = services?.filter((s) => selectedServices.includes(s.id)).map((s) => s.price) ?? [];

      const totalPrice = servicePrices.map(Number).reduce((acc, price) => acc + price, 0);

      if (!totalPrice) {
        toast.error("Serviço inválido.");
        return;
      }

      const [hours, minutes] = hour.split(":").map(Number);
      const fullDateTime = new Date(date);
      fullDateTime.setHours(hours, minutes, 0, 0);

      const payload = {
        barbershopId: barbershop.id,
        clientId: client.id,
        employeeId: selectedBarber,
        dateTime: fullDateTime,
        totalPrice: Number(totalPrice),
        servicesIds: selectedServices,
      };

      await api.post("/scheduling/create", payload);

      toast.success("Agendamento realizado com sucesso!");
      router.push("/client/scheduling");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao realizar agendamento.");
    }
  };

  const handleHourClick = (time: string) => setHour(time);
  const handleDateClick = (newDate?: Date) => {
    if (newDate) {
      setDate(newDate);
      setHour(undefined);
    }
  };

  const canProceed = !!selectedBarber && selectedServices && selectedServices.length > 0 && !!hour && !!date;

  if (isLoading) return <p className="p-6 text-muted-foreground">Carregando barbearia...</p>;
  if (!barbershop) return null;

  return (
    <DashboardLayout sidebar={<ClientSidebar />} title="Minha Área">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4">{barbershop.name}</h1>

          <div className="relative w-full h-64 mb-6">
            <Image
              src={barbershop.imageUrl}
              alt={`Imagem da barbearia ${barbershop.name}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <p className="text-muted-foreground mb-4">
            Horário de funcionamento: {barbershop.timeOpen} – {barbershop.timeClose}
          </p>
        </div>

        {services && services.length > 0 && (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="text-barber-blue">4. Escolha o Serviço</CardTitle>
              <CardDescription>Confira os serviços oferecidos pela barbearia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      (selectedServices ?? []).includes(service.id)
                        ? "border-barber-blue bg-blue-50"
                        : "border-gray-200 hover:border-barber-blue"
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-barber-blue">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                    <p className="text-barber-blue font-bold">R$ {service.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-barber-blue">1. Escolha o Barbeiro</CardTitle>
            <CardDescription>Selecione o profissional de sua preferência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {barbers &&
                barbers.map((barber) => (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedBarber === barber.id
                        ? "border-barber-blue bg-blue-50"
                        : "border-gray-200 hover:border-barber-blue"
                    }`}
                  >
                    <div className="text-center mb-4">
                      <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-barber-blue">
                        <AvatarFallback className="bg-barber-blue text-white">
                          {barber.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-barber-blue">{barber.name}</h3>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="border-t border-gray-200 pt-8">
          <Card className="mb-10">
            <CardHeader>
              <CardTitle className="text-barber-blue">2. Escolha a Data</CardTitle>
              <CardDescription>Selecione o dia para o seu corte</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateClick}
                className="w-full rounded-lg border"
                locale={ptBR}
                hidden={{ before: new Date() }}
                styles={{
                  weekday: { width: "100%" },
                  day: { width: "100%" },
                  button: { width: "100%" },
                  button_previous: { width: "fit-content" },
                  button_next: { width: "fit-content" },
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-barber-blue">3. Escolha o Horário</CardTitle>
              <CardDescription>Selecione o melhor horário disponível</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-start justify-center">
                {timeList.map((time) => (
                  <Button
                    key={time}
                    onClick={() => handleHourClick(time)}
                    variant={hour === time ? "default" : "outline"}
                    className="text-sm h-10 lg:w-36 lg:h-16 min-w-[80px] text-center"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          {canProceed && (
            <Card className="mt-10">
              <CardHeader>
                <CardTitle className="text-barber-blue">Resumo do Agendamento</CardTitle>
                <CardDescription>Confirme os dados do seu atendimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-barber-blue">Barbeiro:</span>
                      <div className="text-barber-gray">{barbers?.find((b) => b.id === selectedBarber)?.name}</div>
                    </div>
                    <div>
                      <span className="font-medium text-barber-blue">Serviços:</span>
                      <ul className="text-barber-gray list-disc list-inside">
                        {services
                          ?.filter((s) => selectedServices?.includes(s.id))
                          .map((s) => (
                            <li key={s.id}>{s.name}</li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-barber-blue">Data:</span>
                      <div className="text-barber-gray">
                        {date.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-barber-blue">Horário:</span>
                      <div className="text-barber-gray">{hour}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-barber-blue">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$
                      {services
                        ?.filter((s) => selectedServices?.includes(s.id))
                        .reduce((acc, s) => acc + Number(s.price), 0)
                        .toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleScheduling}
                    className="w-full bg-barber-blue hover:bg-barber-blue-light"
                    size="lg"
                  >
                    <CalendarIcon />
                    Confirmar Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
