"use client";


import React from 'react';
import DashboardLayout from '../../_components/DashboardLayout';
import AdminSidebar from '../../_components/AdminSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../_components/shadcn/ui/select';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

const AdminReports: React.FC = () => {
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000, services: 245 },
    { month: 'Fev', revenue: 18000, services: 298 },
    { month: 'Mar', revenue: 16500, services: 267 },
    { month: 'Abr', revenue: 19200, services: 312 },
    { month: 'Mai', revenue: 21000, services: 342 },
    { month: 'Jun', revenue: 18450, services: 301 }
  ];

  const servicesByBarber = [
    { name: 'João Santos', services: 156, revenue: 6240 },
    { name: 'Carlos Silva', services: 143, revenue: 5720 },
    { name: 'Pedro Costa', services: 128, revenue: 5120 },
    { name: 'Lucas Ferreira', services: 98, revenue: 3920 }
  ];

  const popularServices = [
    { name: 'Corte Masculino', value: 45, color: '#1e3a5f' },
    { name: 'Barba', value: 25, color: '#2c5282' },
    { name: 'Corte + Barba', value: 20, color: '#4a5568' },
    { name: 'Outros', value: 10, color: '#e2e8f0' }
  ];

  const hourlyDistribution = [
    { hour: '8h', bookings: 12 },
    { hour: '9h', bookings: 18 },
    { hour: '10h', bookings: 25 },
    { hour: '11h', bookings: 28 },
    { hour: '12h', bookings: 15 },
    { hour: '13h', bookings: 10 },
    { hour: '14h', bookings: 22 },
    { hour: '15h', bookings: 32 },
    { hour: '16h', bookings: 28 },
    { hour: '17h', bookings: 24 },
    { hour: '18h', bookings: 16 }
  ];

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      title="Relatórios e Analytics"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-barber-blue">Relatórios</h1>
            <p className="text-barber-gray">Análises detalhadas do desempenho da barbearia</p>
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="last6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                <SelectItem value="last3months">Últimos 3 meses</SelectItem>
                <SelectItem value="last6months">Últimos 6 meses</SelectItem>
                <SelectItem value="lastyear">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-barber-blue hover:bg-barber-blue-light">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">R$ 108.150</div>
              <p className="text-xs text-green-600">+15% vs período anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
              <Calendar className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">1.765</div>
              <p className="text-xs text-green-600">+12% vs período anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
              <Users className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">247</div>
              <p className="text-xs text-green-600">+18% vs período anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-barber-blue">R$ 61,28</div>
              <p className="text-xs text-green-600">+3% vs período anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-barber-blue">Evolução do Faturamento</CardTitle>
              <CardDescription>Faturamento e quantidade de serviços por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `R$ ${value}` : value,
                      name === 'revenue' ? 'Faturamento' : 'Serviços'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1e3a5f" 
                    fill="#1e3a5f" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Services by Barber */}
          <Card>
            <CardHeader>
              <CardTitle className="text-barber-blue">Performance por Barbeiro</CardTitle>
              <CardDescription>Serviços realizados por profissional</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicesByBarber} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="services" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-barber-blue">Serviços Mais Populares</CardTitle>
              <CardDescription>Distribuição de serviços realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={popularServices}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent ? percent : 0 * 100).toFixed(0)}%`}
                  >
                    {popularServices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hourly Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-barber-blue">Distribuição por Horário</CardTitle>
              <CardDescription>Agendamentos ao longo do dia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#1e3a5f" 
                    strokeWidth={3}
                    dot={{ fill: '#1e3a5f', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-barber-blue">Resumo Mensal</CardTitle>
            <CardDescription>Detalhamento mês a mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Mês</th>
                    <th className="text-right p-2">Faturamento</th>
                    <th className="text-right p-2">Serviços</th>
                    <th className="text-right p-2">Ticket Médio</th>
                    <th className="text-right p-2">Crescimento</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRevenue.map((item, index) => (
                    <tr key={item.month} className="border-b">
                      <td className="p-2 font-medium">{item.month}</td>
                      <td className="text-right p-2">R$ {item.revenue.toLocaleString()}</td>
                      <td className="text-right p-2">{item.services}</td>
                      <td className="text-right p-2">R$ {(item.revenue / item.services).toFixed(2)}</td>
                      <td className="text-right p-2">
                        {index > 0 && (
                          <span className={`${
                            item.revenue > monthlyRevenue[index - 1].revenue 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {((item.revenue - monthlyRevenue[index - 1].revenue) / monthlyRevenue[index - 1].revenue * 100).toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;