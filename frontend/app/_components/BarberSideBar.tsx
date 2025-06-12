"use client";

import { 
  LayoutDashboard, 
  Users, 
  Scissors,
  Calendar,
  History,
} from 'lucide-react';
import Link from 'next/link';

const BarberSidebar: React.FC = () => {

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/barbershop/dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/barbershop/schedule' },
    { icon: Users, label: 'Clientes', path: '/barbershop/clients' },
    { icon: History, label: 'Histórico', path: '/barbershop/history' },
  ];

  return (
    <nav className="h-full pt-6">
      <div className="px-4 mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Scissors className="w-6 h-6 text-white" />
          <h2 className="text-lg font-semibold text-white">Barbeiro</h2>
        </div>
        <p className="text-sm text-barber-cream opacity-75">Área do Profissional</p>
      </div>
      
      <ul className="space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white text-barber-blue'
                    : 'text-white hover:bg-barber-blue-light'
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
};

export default BarberSidebar;