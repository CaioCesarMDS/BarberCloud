"use client";

import ClientSideBar from "@/app/_components/ClientSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";
import Header from "@/app/_components/Headerr";
import SubscribedBarberCard from "@/app/_components/SubscribedBarberCard";
import { Avatar, AvatarFallback } from "@/app/_components/shadcn/ui/avatar";
import { Badge } from "@/app/_components/shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/shadcn/ui/card";
import { api } from "@/app/_services/api";
import { Barbershop } from "@/app/_types/barbershop";
import { Scheduling } from "@/app/_types/scheduling";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SubscribedBarbershop extends Barbershop {
  subscribeIn: string;
}

export default function SchedulingPage() {
  const [subscribedBarbershops, setSubscribedBarbershops] = useState<SubscribedBarbershop[]>([]);
  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  const [loading, setLoading] = useState(true);

  const getClientId = async () => {
    try {
      const response = await api.get("auth/me");
      return response.data.id;
    } catch (error) {
      console.error("Erro ao obter o ID do cliente", error);
      return null;
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      const clientId = await getClientId();
      if (clientId) {
        const { data } = await api.get(`/client/${clientId}/subscriptions`);
        const mapped: SubscribedBarbershop[] = data.map((item: any) => ({
          id: item.barbershopId,
          name: item.name,
          imageUrl: item.imageUrl,
          timeOpen: item.timeOpen,
          timeClose: item.timeClose,
          subscribeIn: item.subscribeIn,
        }));
        console.log("Mapped barbershops:", mapped);
        setSubscribedBarbershops(mapped);
      }
    } catch (error) {
      console.error("Erro ao buscar barbearias inscritas:", error);
      toast("Erro ao buscar barbearias inscritas!");
    }
  };

  async function fetchSchedulings() {
    try {
      const clientId = await getClientId();
      if (clientId) {
        const res = await api.get(`/scheduling/all/client/`, { params: { clientId: clientId } });
        setSchedulings(res.data);
      }
    } catch (error) {
      toast.error("Erro ao carregar agendamentos. Tente novamente mais tarde.");
      console.error("Erro ao carregar agendamentos", error);
    } finally {
      setLoading(false);
    }
  }
  
  
  useEffect(() => {
    fetchSchedulings();
    fetchUserSubscriptions();
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "DONE":
        return "bg-green-200 text-green-800";
      case "CANCEL":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }

  return (
    <DashboardLayout sidebar={<ClientSideBar />} title="Seus Agendamentos">
      <div className="h-full max-w mx-auto xl:p-6 grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        <Card>
          <CardHeader className="p-2 sm:p-3">
            <CardTitle className="text-barber-blue text-sm md:text-md">Inscrições</CardTitle>
            <CardDescription className="text-xs md:text-sm">Lista completa de todas as Barbearias em que você está Inscrito</CardDescription>
          </CardHeader>
          <CardContent className="h-full h-[calc(100vh-185px)] overflow-y-auto flex flex-col items-center p-2 sm:p-3">
          <div className="space-y-2 sm:space-y-4">
            {subscribedBarbershops.map((barbershop) => (
              <SubscribedBarberCard
              key={`${barbershop.id}-${barbershop.subscribeIn}`}
              barbershop={barbershop}
              onUnsubscribe={fetchUserSubscriptions}
            />
            ))}
          </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="sm:p-3">
            <CardTitle className="text-barber-blue text-sm md:text-md">Agendamentos</CardTitle>
            <CardDescription className="text-xs md:text-sm">Lista completa de todos os seus agendamentos pendentes</CardDescription>
          </CardHeader>
          <CardContent className="h-full h-[calc(100vh-185px)] overflow-y-auto p-3">
            {loading && (
              <p>Carregando agendamentos...</p>
            )}

            {!schedulings.length && (
              <p>Você não tem agendamentos pendentes.</p>
            )}
            
            {!!schedulings.length && (
              <div className="space-y-4">
              {schedulings.filter((service) => service.status === 'PENDING').map((service) => {
                const serviceNames = service.services.map((s) => s.name).join(", ");
                const date = new Date(service.dateTime);
                const time = date.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const employeeName = service.employeeName ?? "Funcionário não informado";
                const employeeInitials =
                  service.employeeName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ?? "??";

                return (
                  <div key={service.id} className="border rounded-lg p-2 lg:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between gap-2 lg:gap-4">
                      <div className="flex items-center space-x-2 lg:space-x-4">
                        <Avatar className="h-8 w-8 lg:h-12 lg:w-12 border-2 border-barber-blue">
                          <AvatarFallback className="bg-barber-blue text-white">{employeeInitials}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="text-md md:text-lg font-semibold text-barber-blue">{employeeName}</div>
                          <div className="text-xs md:text-md text-barber-gray">{serviceNames}</div>
                          <div className="flex items-center space-x-1 lg:space-x-2 text-sm text-barber-gray">
                            <Calendar className="h-3 w-3" />
                            <span>{date.toLocaleDateString("pt-BR")}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-md md:text-lg font-bold text-green-600">R$ {service.totalPrice}</div>
                          <Badge className={getStatusColor(service.status) + 'text-md md:text-lg'}>{service.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
