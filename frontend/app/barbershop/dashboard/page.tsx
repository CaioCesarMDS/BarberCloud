"use client";

import { api } from "@/app/_services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "../../_components/AdminSideBar";
import BarberSidebar from "../../_components/BarberSideBar";
import DashboardLayout from "../../_components/DashboardLayout";
import { Calendar, DollarSign, Scissors, Star, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/shadcn/ui/card";
import { Button } from "@/app/_components/shadcn/ui/button";
import { Avatar, AvatarFallback } from "@/app/_components/shadcn/ui/avatar";
import { Badge } from "@/app/_components/shadcn/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  {/*Inicio dos mocks*/ }

  const todayAppointments = [
    {
      id: 1,
      clientName: 'João Silva',
      service: 'Corte + Barba',
      time: '09:00',
      duration: 50,
      price: 40,
      status: 'Confirmado'
    },
    {
      id: 2,
      clientName: 'Pedro Santos',
      service: 'Corte Masculino',
      time: '10:30',
      duration: 30,
      price: 25,
      status: 'Confirmado'
    },
    {
      id: 3,
      clientName: 'Carlos Lima',
      service: 'Barba',
      time: '14:00',
      duration: 25,
      price: 20,
      status: 'Pendente'
    },
    {
      id: 4,
      clientName: 'Rafael Costa',
      service: 'Corte Masculino',
      time: '16:00',
      duration: 30,
      price: 25,
      status: 'Confirmado'
    }
  ];

  const recentClients = [
    { name: 'João Silva', lastVisit: '2024-01-15', totalVisits: 12 },
    { name: 'Pedro Santos', lastVisit: '2024-01-14', totalVisits: 8 },
    { name: 'Carlos Lima', lastVisit: '2024-01-12', totalVisits: 5 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // aqui seria a requisição dos stats da barbearia tem que fazer no backend com este formato:
  // title, value, change, changeType, icon, description
  const statsCards = [
    {
      title: 'Clientes Ativos',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'vs. mês anterior'
    },
    {
      title: 'Faturamento',
      value: 'R$ 18.450',
      change: '-8%',
      changeType: 'negative' as const,
      icon: DollarSign,
      description: 'este mês'
    },
    {
      title: 'Agendamentos',
      value: '342',
      change: '+23%',
      changeType: 'positive' as const,
      icon: Calendar,
      description: 'esta semana'
    },
    {
      title: 'Serviços Realizados',
      value: '1,856',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Scissors,
      description: 'este mês'
    }
  ];

  const revenueData = [
    { name: 'Jan', value: 15000 },
    { name: 'Fev', value: 18000 },
    { name: 'Mar', value: 16500 },
    { name: 'Abr', value: 19200 },
    { name: 'Mai', value: 21000 },
    { name: 'Jun', value: 18450 }
  ];

  const servicesData = [
    { name: 'Corte', value: 45, fill: '#1e3a5f' },
    { name: 'Barba', value: 25, fill: '#2c5282' },
    { name: 'Corte + Barba', value: 20, fill: '#4a5568' },
    { name: 'Outros', value: 10, fill: '#e2e8f0' }
  ];

  const dailyBookings = [
    { day: 'Seg', bookings: 28 },
    { day: 'Ter', bookings: 35 },
    { day: 'Qua', bookings: 42 },
    { day: 'Qui', bookings: 38 },
    { day: 'Sex', bookings: 45 },
    { day: 'Sáb', bookings: 52 },
    { day: 'Dom', bookings: 25 }
  ];

  {/*Fim dos mocks*/ }
  const router = useRouter();

  interface User {
    id: string;
    name: string;
    role: "ADMIN" | "EMPLOYEE";
  }

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isBarber, setIsBarber] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const { data: authData } = await api.get("/auth/me");
      const { data: userData } = await api.get(`/employee/${authData.id}`);
      setUser(userData);
      console.log(user)
      if (userData.role === "ADMIN") {
        setIsAdmin(true);
      } else if (userData.role === "EMPLOYEE") {
        setIsBarber(true);
      }
    } catch (error) {
      console.log("Erro ao buscar informações do usuário:", error);
      router.push("/barbershop/signin");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("barber-token");
    if (!token) {
      router.push("/barbershop/signin");
      return;
    }

    fetchUser();
  }, [router]);

  return (
    <main>
      {isAdmin && (
        <DashboardLayout
          sidebar={<AdminSidebar />}
          title="Dashboard Administrativo"
        >
          <div className="space-y-4">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta! 👋</h1>
              <p className="opacity-90">Aqui está um resumo do seu negócio hoje</p>
            </div>

            <div className="p-2 space-y-4 h-[calc(100vh-40vh)] overflow-y-auto">

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {statsCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-barber-gray">
                          {stat.title}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-barber-blue" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-barber-blue">{stat.value}</div>
                        <p className="text-xs text-barber-gray">
                          <span className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {stat.change}
                          </span>
                          {' '}{stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-barber-blue">Faturamento Mensal</CardTitle>
                    <CardDescription>
                      Receita dos últimos 6 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#1e3a5f"
                          fill="#1e3a5f"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Services Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-barber-blue">Distribuição de Serviços</CardTitle>
                    <CardDescription>
                      Serviços mais populares
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={servicesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `46.8%`}
                        >
                          {servicesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-barber-blue">Agendamentos da Semana</CardTitle>
                  <CardDescription>
                    Distribuição de agendamentos por dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyBookings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="bg-barber-blue rounded-full p-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-barber-blue">Gerenciar Clientes</h3>
                      <p className="text-sm text-barber-gray">Adicionar novos clientes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="bg-barber-blue rounded-full p-3">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-barber-blue">Ver Agenda</h3>
                      <p className="text-sm text-barber-gray">Verificar agendamentos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="bg-barber-blue rounded-full p-3">
                      <Scissors className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-barber-blue">Configurar Serviços</h3>
                      <p className="text-sm text-barber-gray">Gerenciar preços e tipos</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DashboardLayout>
      )}

      {isBarber && (
        <DashboardLayout
          sidebar={<BarberSidebar />}
          title="Dashboard do Barbeiro"
        >
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Olá, João! ✂️</h1>
              <p className="opacity-90">Você tem {todayAppointments.length} agendamentos para hoje</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-barber-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-barber-blue">{todayAppointments.length}</div>
                  <p className="text-xs text-barber-gray">agendamentos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                  <Scissors className="h-4 w-4 text-barber-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-barber-blue">28</div>
                  <p className="text-xs text-barber-gray">serviços realizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-barber-blue">4.8</div>
                  <p className="text-xs text-barber-gray">média de 156 avaliações</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-barber-blue">R$ 1.240</div>
                  <p className="text-xs text-barber-gray">esta semana</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-barber-blue">Agenda de Hoje</CardTitle>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver Semana
                      </Button>
                    </div>
                    <CardDescription>
                      {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-barber-gray-light transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-barber-blue">{appointment.time}</div>
                              <div className="text-xs text-barber-gray">{appointment.duration}min</div>
                            </div>
                            <Avatar>
                              <AvatarFallback className="bg-barber-blue text-white">
                                {appointment.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-barber-blue">{appointment.clientName}</div>
                              <div className="text-sm text-barber-gray">{appointment.service}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <div className="text-sm font-semibold text-green-600 mt-1">
                              R$ {appointment.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Clients */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-barber-blue">Clientes Recentes</CardTitle>
                    <CardDescription>Últimos atendimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentClients.map((client, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-barber-blue text-white">
                              {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-barber-blue">{client.name}</div>
                            <div className="text-sm text-barber-gray">
                              {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {client.totalVisits} visitas
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Users className="h-4 w-4 mr-2" />
                      Ver Todos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className="bg-barber-blue rounded-full p-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barber-blue">Novo Agendamento</h3>
                    <p className="text-sm text-barber-gray">Agendar cliente</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className="bg-barber-blue rounded-full p-3">
                    <Scissors className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barber-blue">Registrar Serviço</h3>
                    <p className="text-sm text-barber-gray">Sem agendamento</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className="bg-barber-blue rounded-full p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barber-blue">Buscar Cliente</h3>
                    <p className="text-sm text-barber-gray">Localizar cadastro</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      )}
    </main>
  );
};

export default Dashboard;
