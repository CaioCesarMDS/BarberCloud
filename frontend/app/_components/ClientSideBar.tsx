"use client";

import { Calendar, History, LayoutDashboard, Scissors, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientSideBar() {
  const pathnName = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/client/dashboard" },
    { icon: Scissors, label: "Barbearias", path: "/client/barbershop" },
    { icon: Calendar, label: "Agendar", path: "/client/scheduling" },
    { icon: History, label: "Histórico", path: "/client/history" },
    { icon: User, label: "Meu Perfil", path: "/client/profile" },
  ];

  return (
    <nav className="h-full pt-6">
      <div className="px-4 mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Cliente</h2>
        <p className="text-sm text-barber-cream opacity-75">Área do Cliente</p>
      </div>

      <ul className="space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathnName === item.path;

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-white text-barber-blue" : "text-white hover:bg-barber-blue-light"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
