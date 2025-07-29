"use client";

import { 
  LayoutDashboard, 
  Users, 
  Scissors, 
  Settings, 
  BarChart3,
  User,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

const AdminSidebar: React.FC = () => { 

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/barbershop/dashboard' },
    { icon: Users, label: 'Clientes', path: '/barbershop/clients' },
    { icon: User, label: 'Barbeiros', path: '/barbershop/barbers' },
    { icon: Calendar, label: 'Agenda', path: '/barbershop/agenda' },
    { icon: Scissors, label: 'Serviços', path: '/barbershop/services' },
    { icon: BarChart3, label: 'Relatórios', path: '/barbershop/reports' },
    { icon: Settings, label: 'Configurações', path: '/barbershop/settings'}
  ];

  return (
    <nav className="h-full pt-4">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Administração</h2>
        <p className="text-sm text-barber-cream opacity-75">Painel do Proprietário</p>
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

export default AdminSidebar;