"use client";

import DashboardLayout from '../../_components/DashboardLayout';
import BarberSidebar from '../../_components/BarberSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Badge } from '../../_components/shadcn/ui/badge';
import { Avatar, AvatarFallback } from '../../_components/shadcn/ui/avatar';
import { Calendar, Clock, Users, Scissors, Star, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/app/services/api';

const BarberDashboard: React.FC = () => {
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
        router.push("/barbershop/signin");
        return;
      }
  
      const fetchUser = async () => {
        try {
          const { data: authData } = await api.get("/auth/me");
          const { data: userData } = await api.get(`/employee/${authData.id}`);
          setUser(userData);
        } catch (error) {
          console.error("Erro ao buscar informações do usuário:", error);
          router.push("/barbershop/signin");
        }
      };
  
      fetchUser();
    }, [router]);

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

  return (
    <DashboardLayout
      sidebar={<BarberSidebar />}
      title="Dashboard do Barbeiro"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Olá, {user?.name}! ✂️</h1>
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
  );
};

export default BarberDashboard;