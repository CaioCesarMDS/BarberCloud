"use client";

import { Cloud, LogOut, Menu, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../_components/shadcn/ui/avatar";
import { Button } from "../_components/shadcn/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../_components/shadcn/ui/sheet";
import { api } from "../services/api";
import mitt from "mitt";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar, title }) => {
  const router = useRouter();
  const eventBus = mitt<{ profileUpdated: void }>()

  interface User {
    id: string;
    name: string;
    role: "ADMIN" | "EMPLOYEE";
  }

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.role) {
        const { data: userData } = await api.get(`/employee/${response.data.id}`);
        setUser(userData)
      } else {
        const { data: userData } = await api.get(`/client/${response.data.id}`);
        setUser(userData)
      }
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("barber-token");
    if (!token) {
      router.push("/signin");
      return;
    }

    eventBus.on('profileUpdated', fetchUser)

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
      case "ADMIN":
        return "Administrador";
      case "EMPLOYEE":
        return "Barbeiro";
      default:
        return "Cliente";
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
                <SheetTitle className="sr-only">Menu</SheetTitle>
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
