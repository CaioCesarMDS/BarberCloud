"use client";

import { Avatar, AvatarFallback } from "@/app/_components/shadcn/ui/avatar";
import { Badge } from "@/app/_components/shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/shadcn/ui/card";
import { api } from "@/app/_services/api";
import { Scheduling } from "@/app/_types/scheduling";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SchedulingPage() {
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

  useEffect(() => {
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
    fetchSchedulings();
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

  if (loading) return <p>Carregando agendamentos...</p>;

  if (!schedulings.length) return <p>Você não tem agendamentos.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-barber-blue">Agendamentos</CardTitle>
          <CardDescription>Lista completa de todos os seus agendamentos pendentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedulings.map((service) => {
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
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-barber-blue">
                        <AvatarFallback className="bg-barber-blue text-white">{employeeInitials}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="font-semibold text-barber-blue">{employeeName}</div>
                        <div className="text-sm text-barber-gray">{serviceNames}</div>
                        <div className="flex items-center space-x-2 text-sm text-barber-gray">
                          <Calendar className="h-3 w-3" />
                          <span>{date.toLocaleDateString("pt-BR")}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">R$ {service.totalPrice}</div>
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
