"use client";

import { useRouter } from "next/navigation";
import { api } from "../../_services/api";
// import Link from "next/link";
// import { AxiosError } from "axios";
// import { toast, Toaster } from "sonner";
import AdminSidebar from "@/app/_components/AdminSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";
import { useEffect, useState } from "react";

export default function Settings() {
  const router = useRouter();

  interface User {
    id: string;
    name: string;
    role: "ADMIN" | "EMPLOYEE";
  }

  const [user, setUser] = useState<User | null>(null);
  // const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // const [isBarber, setIsBarber] = useState<boolean>(false);

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
          console.log(user);
        } else if (userData.role === "EMPLOYEE") {
          router.push("/barbershop/dashboard");
        }
      } catch (error) {
        console.log("Erro ao buscar informações do usuário:", error);
        router.push("/barbershop/signin");
      }
    };

    fetchUser();
  }, [router, user]);

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="Dashboard do Admin">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Configurações</h1>
        </div>
      </div>
    </DashboardLayout>
  );
}
