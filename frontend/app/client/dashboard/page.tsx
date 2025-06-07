"use client";

import { Calendar, Clock, MapPin, Phone, Scissors, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClientSidebar from "../../_components/ClientSideBar";
import DashboardLayout from "../../_components/DashboardLayout";
import { Avatar, AvatarFallback } from "../../_components/shadcn/ui/avatar";
import { Badge } from "../../_components/shadcn/ui/badge";
import { Button } from "../../_components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../_components/shadcn/ui/card";
import api from "../../services/api";

const ClientDashboard: React.FC = () => {
  const router = useRouter();

  interface User {
    id: string;
    name: string;
    role: "admin" | "barber" | "client";
  }

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("barber-token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data: authData } = await api.get("/auth/me");
        const { data: userData } = await api.get(`/users/${authData.id}`);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        router.push("/signin");
      }
    };

    fetchUser();
  }, [router]);

  const upcomingAppointments = [
    {
      id: 1,
      barberName: "João Santos",
      service: "Corte + Barba",
      date: "2024-01-20",
      time: "14:00",
      duration: 50,
      price: 40,
      status: "Confirmado",
    },
    {
      id: 2,
      barberName: "Carlos Silva",
      service: "Corte Masculino",
      date: "2024-02-05",
      time: "09:30",
      duration: 30,
      price: 25,
      status: "Pendente",
    },
  ];

  const recentVisits = [
    {
      id: 1,
      barberName: "João Santos",
      service: "Corte + Barba",
      date: "2024-01-15",
      rating: 5,
      price: 40,
    },
    {
      id: 2,
      barberName: "Carlos Silva",
      service: "Corte Masculino",
      date: "2024-01-10",
      rating: 4,
      price: 25,
    },
    {
      id: 3,
      barberName: "João Santos",
      service: "Barba",
      date: "2024-01-05",
      rating: 5,
      price: 20,
    },
  ];

  const barbershopInfo = {
    name: "BarberCloud Premium",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 3333-3333",
    hours: "Seg-Sex: 8h-18h | Sáb: 8h-16h",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <DashboardLayout sidebar={<ClientSidebar />} title="Minha Área">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{`Bem vindo, ${user?.name}`} ✨</h1>
          <p className="opacity-90">
            {upcomingAppointments.length > 0
              ? `Você tem ${upcomingAppointments.length} agendamento(s) próximo(s)`
              : "Que tal agendar seu próximo corte?"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Agendamento</CardTitle>
              <Calendar className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <>
                  <div className="text-2xl font-bold text-barber-blue">
                    {new Date(upcomingAppointments[0].date).getDate()}/
                    {new Date(upcomingAppointments[0].date).getMonth() + 1}
                  </div>
                  <p className="text-xs text-barber-gray">às {upcomingAppointments[0].time}</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-barber-gray">--</div>
                  <p className="text-xs text-barber-gray">Nenhum agendamento</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
              <Scissors className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">{recentVisits.length + 12}</div>
              <p className="text-xs text-barber-gray">desde o cadastro</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">
                {(recentVisits.reduce((acc, visit) => acc + visit.rating, 0) / recentVisits.length).toFixed(1)}
              </div>
              <p className="text-xs text-barber-gray">suas avaliações</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-barber-blue">Próximos Agendamentos</CardTitle>
                  <Button className="bg-barber-blue hover:bg-barber-blue-light">
                    <Calendar className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>
                <CardDescription>Seus próximos atendimentos agendados</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-barber-gray-light transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-barber-blue">
                              {new Date(appointment.date).getDate()}
                            </div>
                            <div className="text-xs text-barber-gray">
                              {new Date(appointment.date).toLocaleDateString("pt-BR", { month: "short" })}
                            </div>
                          </div>
                          <Avatar>
                            <AvatarFallback className="bg-barber-blue text-white">
                              {appointment.barberName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-barber-blue">{appointment.barberName}</div>
                            <div className="text-sm text-barber-gray">{appointment.service}</div>
                            <div className="text-sm text-barber-gray">
                              {appointment.time} • {appointment.duration}min
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          <div className="text-sm font-semibold text-green-600 mt-1">R$ {appointment.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-barber-gray mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-barber-blue mb-2">Nenhum agendamento</h3>
                    <p className="text-barber-gray mb-4">Você não tem agendamentos próximos.</p>
                    <Button className="bg-barber-blue hover:bg-barber-blue-light">Agendar Atendimento</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Barbershop Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-barber-blue">Informações da Barbearia</CardTitle>
                <CardDescription>Dados de contato e funcionamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-barber-blue">{barbershopInfo.name}</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-barber-gray mt-0.5" />
                    <span className="text-sm">{barbershopInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-barber-gray" />
                    <span className="text-sm">{barbershopInfo.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-barber-gray mt-0.5" />
                    <span className="text-sm">{barbershopInfo.hours}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver Localização
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-barber-blue">Últimas Visitas</CardTitle>
            <CardDescription>Histórico dos seus últimos atendimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-barber-blue text-white">
                        {visit.barberName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-barber-blue">{visit.barberName}</div>
                      <div className="text-sm text-barber-gray">{visit.service}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-barber-gray">{new Date(visit.date).toLocaleDateString("pt-BR")}</div>
                    <div className="text-right">
                      <div className="text-yellow-500 text-sm">{getStars(visit.rating)}</div>
                      <div className="text-sm font-semibold text-green-600">R$ {visit.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Button variant="outline">Ver Histórico Completo</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="bg-barber-blue rounded-full p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-barber-blue">Agendar Atendimento</h3>
                <p className="text-sm text-barber-gray">Escolha data e barbeiro</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="bg-barber-blue rounded-full p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-barber-blue">Meu Perfil</h3>
                <p className="text-sm text-barber-gray">Atualizar informações</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="bg-barber-blue rounded-full p-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-barber-blue">Avaliar Serviços</h3>
                <p className="text-sm text-barber-gray">Compartilhe sua experiência</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
