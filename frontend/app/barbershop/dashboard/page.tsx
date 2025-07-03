"use client";

import { api } from "@/app/_services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "../../_components/AdminSideBar";
import BarberSidebar from "../../_components/BarberSideBar";
import DashboardLayout from "../../_components/DashboardLayout";
import { Calendar, DollarSign, Scissors, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/shadcn/ui/card";

const BarberDashboard: React.FC = () => {
  const router = useRouter();

  interface User {
    id: string;
    name: string;
    role: "ADMIN" | "EMPLOYEE";
  }

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
      change: '+8%',
      changeType: 'positive' as const,
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

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isBarber, setIsBarber] = useState<boolean>(false);

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

    fetchUser();
  }, [router]);

  return (
    <main>
      {isAdmin && (
        <DashboardLayout sidebar={<AdminSidebar />} title="Dashboard do Admin">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Olá, {user?.name}! ✂️</h1>
              <p className="opacity-90">Aqui está um resumo do seu negócio hoje!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        </DashboardLayout>
      )}

      {isBarber && (
        <DashboardLayout sidebar={<BarberSidebar />} title="Dashboard do Barbeiro">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Olá, {user?.name}! ✂️</h1>
            </div>
          </div>
        </DashboardLayout>
      )}
    </main>
  );
};

export default BarberDashboard;
