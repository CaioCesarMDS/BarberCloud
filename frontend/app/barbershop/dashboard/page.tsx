"use client";

import api from "@/app/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BarberSidebar from "../../_components/BarberSideBar";
import DashboardLayout from "../../_components/DashboardLayout";
import AdminSidebar from "../../_components/AdminSideBar";

const BarberDashboard: React.FC = () => {
  const router = useRouter();

  interface User {
    id: string;
    name: string;
    role: "ADMIN" | "EMPLOYEE";
  }

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
        if (userData.role === 'ADMIN') {
          setIsAdmin(true)
        } else if (userData.role === 'EMPLOYEE') {
          setIsBarber(true)
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
