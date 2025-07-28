"use client";

import { Avatar, AvatarFallback } from "@/app/_components/shadcn/ui/avatar";
import { Button } from "@/app/_components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/shadcn/ui/card";
import { Scheduling } from "@/app/_types/scheduling";
import { AxiosError } from "axios";
import { Calendar, Clock, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import ClientSidebar from "../../_components/ClientSideBar";
import DashboardLayout from "../../_components/DashboardLayout";
import { api } from "../../_services/api";

const ClientDashboard: React.FC = () => {
  const router = useRouter();

  interface User {
    id: string;
    name: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);

  const fetchUser = async () => {
    try {
      const { data: authData } = await api.get("/auth/me");
      const { data: userData } = await api.get(`/client/${authData.id}`);
      setUser(userData);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during get user:", error);
        if (error.status === 400) {
          toast("Erro ao buscar informações do usuário!");
        }
      }
      router.push("/client/signin");
    }
  };

  async function fetchSchedulings() {
    try {
      const clientId = user?.id;
      if (clientId) {
        const res = await api.get(`/scheduling/all/client/`, { params: { clientId: clientId } });
        setSchedulings(res.data);
      }
    } catch (error) {
      toast.error("Erro ao carregar agendamentos. Tente novamente mais tarde.");
      console.error("Erro ao carregar agendamentos", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("barber-token");
    if (!token) {
      router.push("/client/signin");
      return;
    }

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      fetchSchedulings();
    }
  }, [user]);

  return (
    <DashboardLayout sidebar={<ClientSidebar />} title="Minha Área">
      <Toaster />
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{`Bem vindo, ${user?.name}`} ✨</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Agendamento</CardTitle>
              <Calendar className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              {schedulings.length > 0 ? (
                (() => {
                  const now = new Date();

                  const upcomingSchedulings = schedulings
                    .filter((s) => s.status === "PENDING" && new Date(s.dateTime) > now)
                    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

                  if (upcomingSchedulings.length === 0) {
                    return <div className="text-barber-gray">Nenhum agendamento encontrado.</div>;
                  }

                  const next = new Date(upcomingSchedulings[0].dateTime);

                  return (
                    <div>
                      {next.toLocaleDateString("pt-BR")} às{" "}
                      {next.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  );
                })()
              ) : (
                <div className="text-barber-gray">Você não tem agendamentos pendentes.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quantidade de Agendamentos</CardTitle>
              <Scissors className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>{schedulings.length}</CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-barber-blue">Agendamentos marcados</CardTitle>
                <Button
                  className="bg-barber-blue hover:bg-barber-blue-light"
                  onClick={() => router.push("/client/scheduling")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
              <CardDescription>Seus atendimentos agendados</CardDescription>
            </CardHeader>
            <CardContent className= "h-[calc(100vh-80vh)] overflow-y-auto">
              {schedulings.length > 0 ? (
                <div className="space-y-4">
                  {schedulings
                    .filter((service) => service.status === "PENDING")
                    .map((service) => {
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
                        <div
                          key={service.id}
                          className="border rounded-lg p-2 lg:p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-row items-center justify-between gap-2 lg:gap-4">
                            <div className="flex items-center space-x-2 lg:space-x-4">
                              <Avatar className="h-8 w-8 lg:h-12 lg:w-12 border-2 border-barber-blue">
                                <AvatarFallback className="bg-barber-blue text-white">
                                  {employeeInitials}
                                </AvatarFallback>
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
                                <div className="text-md md:text-lg font-bold text-green-600">
                                  R$ {service.totalPrice}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p>Você não tem agendamentos pendentes.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
