"use client";

import { Cloud, LogOut, Menu, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../_components/shadcn/ui/avatar";
import { Button } from "../_components/shadcn/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../_components/shadcn/ui/sheet";
import api from "../services/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar, title }) => {
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
        const { data: authData } = await api.get("/auth/client/me");
        const { data: userData } = await api.get(`/client/${authData.id}`);
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        router.push("/client/signin");
      }
    };

    fetchUser();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("barber-token");
    router.push("/");
  };

  const getUserInitials = () => {
    if (!user?.name) return "??";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Administrador";
      case "barber":
        return "Barbeiro";
      case "client":
        return "Cliente";
      default:
        return "Usuário";
    }
  };

  if (!user) return null; // Pode adicionar um loader aqui se quiser

  return (
    <div className="min-h-screen bg-barber-cream">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-barber-gray-light">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-barber-blue">
                {sidebar}
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Cloud className="w-8 h-8 text-barber-blue" fill="currentColor" />
                <Scissors className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-xl font-bold text-barber-blue">BarberCloud</span>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-barber-blue">{title}</h1>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-barber-blue">{user?.name}</p>
              <p className="text-xs text-barber-gray">{getRoleLabel()}</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-barber-blue">
              <AvatarFallback className="bg-barber-blue text-white">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <Button
              onClick={logout}
              variant="ghost"
              size="icon"
              className="text-barber-gray hover:text-barber-blue hover:bg-barber-gray-light"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-barber-blue min-h-screen">{sidebar}</aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
