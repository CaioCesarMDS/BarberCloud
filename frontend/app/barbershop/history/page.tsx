"use client"

import React, { useState } from 'react';
import DashboardLayout from '../../_components/DashboardLayout';
import BarberSidebar from '../../_components/BarberSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Badge } from '../../_components/shadcn/ui/badge';
import { Avatar, AvatarFallback } from '../../_components/shadcn/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../_components/shadcn/ui/select';
import { Calendar, Clock, DollarSign, Scissors, Download } from 'lucide-react';

const BarberHistory: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState('last30days');

  const services = [
    {
      id: 1,
      clientName: 'João Silva',
      service: 'Corte + Barba',
      date: '2024-01-15',
      time: '09:00',
      duration: 50,
      price: 40,
      status: 'Concluído',
      rating: 5,
      notes: 'Cliente muito satisfeito'
    },
    {
      id: 2,
      clientName: 'Pedro Santos',
      service: 'Corte Masculino',
      date: '2024-01-14',
      time: '14:30',
      duration: 30,
      price: 25,
      status: 'Concluído',
      rating: 4,
      notes: ''
    },
    {
      id: 3,
      clientName: 'Carlos Lima',
      service: 'Barba',
      date: '2024-01-12',
      time: '16:00',
      duration: 25,
      price: 20,
      status: 'Concluído',
      rating: 5,
      notes: 'Pediu produto recomendado'
    },
    {
      id: 4,
      clientName: 'Rafael Costa',
      service: 'Corte + Barba',
      date: '2024-01-10',
      time: '10:00',
      duration: 50,
      price: 40,
      status: 'Concluído',
      rating: 5,
      notes: 'Cliente regular'
    },
    {
      id: 5,
      clientName: 'Miguel Torres',
      service: 'Corte Masculino',
      date: '2024-01-08',
      time: '15:30',
      duration: 30,
      price: 25,
      status: 'Concluído',
      rating: 4,
      notes: ''
    }
  ];

  const totalRevenue = services.reduce((acc, service) => acc + service.price, 0);
  const averageRating = services.reduce((acc, service) => acc + service.rating, 0) / services.length;

  const getStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <DashboardLayout
      sidebar={<BarberSidebar />}
      title="Histórico de Serviços"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-barber-blue">Histórico de Serviços</h1>
            <p className="text-barber-gray">Acompanhe todos os seus atendimentos realizados</p>
          </div>
          
          <div className="flex gap-2">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                <SelectItem value="last3months">Últimos 3 meses</SelectItem>
                <SelectItem value="lastyear">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              <Scissors className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">{services.length}</div>
              <p className="text-xs text-barber-gray">nos últimos 30 dias</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">R$ {totalRevenue}</div>
              <p className="text-xs text-barber-gray">receita total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">
                R$ {(totalRevenue / services.length).toFixed(2)}
              </div>
              <p className="text-xs text-barber-gray">por serviço</p>
            </CardContent>
          </Card>
        </div>

        {/* Services History */}
        <Card>
          <CardHeader className='p-3'>
            <CardTitle className="text-barber-blue">Histórico Detalhado</CardTitle>
            <CardDescription>
              Lista completa de todos os serviços realizados
            </CardDescription>
          </CardHeader>
          <CardContent className='p-3 h-[calc(100vh-72vh)] overflow-y-auto'>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Service Info */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-barber-blue">
                        <AvatarFallback className="bg-barber-blue text-white">
                          {service.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="font-semibold text-barber-blue">{service.clientName}</div>
                        <div className="text-sm text-barber-gray">{service.service}</div>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-barber-gray" />
                        <span>{new Date(service.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-barber-gray" />
                        <span>{service.time}</span>
                      </div>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">R$ {service.price}</div>
                        <Badge variant="secondary" className="text-xs">
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BarberHistory;