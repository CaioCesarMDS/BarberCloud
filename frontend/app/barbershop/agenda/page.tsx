'use client'

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../_components/DashboardLayout';
import BarberSidebar from '../../_components/BarberSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Badge } from '../../_components/shadcn/ui/badge';
import { Avatar, AvatarFallback } from '../../_components/shadcn/ui/avatar';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminSidebar from '@/app/_components/AdminSideBar';
import { api } from '@/app/_services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Agenda = () => {

    const router = useRouter();

    interface User {
        id: string;
        name: string;
        role: "ADMIN" | "EMPLOYEE";
    }

    const [currentDate, setCurrentDate] = useState(new Date());
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isBarber, setIsBarber] = useState<boolean>(false);

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00'
    ];

    const appointments = [
        {
            id: 1,
            clientName: 'João Silva',
            service: 'Corte + Barba',
            time: '09:00',
            duration: 50,
            day: 1, // Monday
            status: 'Confirmado'
        },
        {
            id: 2,
            clientName: 'Pedro Santos',
            service: 'Corte Masculino',
            time: '14:00',
            duration: 30,
            day: 2, // Tuesday
            status: 'Confirmado'
        },
        {
            id: 3,
            clientName: 'Carlos Lima',
            service: 'Barba',
            time: '16:00',
            duration: 25,
            day: 3, // Wednesday
            status: 'Pendente'
        }
    ];

    const getWeekDates = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day;
        startOfWeek.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });
    };

    const weekDates = getWeekDates();

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    const getAppointmentForSlot = (dayIndex: number, time: string) => {
        return appointments.find(apt => apt.day === dayIndex && apt.time === time);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmado':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Pendente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

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
            toast.info("Erro ao buscar informações do usuário.")
            router.push("/barbershop/signin");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("barber-token");
        if (!token) {
            router.push("/barbershop/signin");
            return;
        }
        fetchUser();
    }, [router]);

    useEffect(() => {
        if (user) {
            console.log(user)
        }
    }, [user]);

    return (
        <main>
            {isBarber && (
                <DashboardLayout sidebar={<BarberSidebar />} title="Agenda de Atendimentos">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-barber-blue">Agenda</h1>
                                <p className="text-barber-gray">Gerencie seus horários e agendamentos</p>
                            </div>

                            <Button className="bg-barber-blue hover:bg-barber-blue-light">
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Agendamento
                            </Button>
                        </div>

                        {/* Week Navigation */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <h2 className="text-xl font-semibold text-barber-blue">
                                        {weekDates[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                    </h2>

                                    <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {weekDates.map((date, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-sm font-medium text-barber-gray mb-1">
                                                {weekDays[date.getDay()]}
                                            </div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${date.toDateString() === new Date().toDateString()
                                                ? 'bg-barber-blue text-white'
                                                : 'text-barber-blue hover:bg-barber-gray-light'
                                                }`}>
                                                {date.getDate()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule Grid */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-barber-blue">Horários da Semana</CardTitle>
                                <CardDescription>
                                    Clique em um horário vazio para criar um novo agendamento
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[800px]">
                                        {/* Header with days */}
                                        <div className="grid grid-cols-8 gap-2 mb-2">
                                            <div className="text-sm font-medium text-barber-gray p-2">Horário</div>
                                            {weekDates.map((date, index) => (
                                                <div key={index} className="text-center text-sm font-medium text-barber-gray p-2">
                                                    {weekDays[date.getDay()]} {date.getDate()}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Time slots */}
                                        <div className="space-y-1">
                                            {timeSlots.map((time) => (
                                                <div key={time} className="grid grid-cols-8 gap-2">
                                                    <div className="text-sm text-barber-gray p-2 font-medium">
                                                        {time}
                                                    </div>
                                                    {Array.from({ length: 7 }, (_, dayIndex) => {
                                                        const appointment = getAppointmentForSlot(dayIndex, time);

                                                        return (
                                                            <div key={dayIndex} className="min-h-[60px]">
                                                                {appointment ? (
                                                                    <div className={`p-2 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(appointment.status)}`}>
                                                                        <div className="text-xs font-semibold truncate">
                                                                            {appointment.clientName}
                                                                        </div>
                                                                        <div className="text-xs opacity-75 truncate">
                                                                            {appointment.service}
                                                                        </div>
                                                                        <div className="text-xs opacity-75">
                                                                            {appointment.duration}min
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-full border-2 border-dashed border-barber-gray-light rounded-lg hover:border-barber-blue hover:bg-barber-gray-light cursor-pointer transition-colors">
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Today's Appointments Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-barber-blue">Agendamentos de Hoje</CardTitle>
                                <CardDescription>
                                    Resumo dos atendimentos para {new Date().toLocaleDateString('pt-BR')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {appointments.slice(0, 3).map((appointment) => (
                                        <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-barber-blue" />
                                                    <span className="font-semibold text-barber-blue">{appointment.time}</span>
                                                </div>
                                                <Badge className={getStatusColor(appointment.status)}>
                                                    {appointment.status}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center space-x-3 mb-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-barber-blue text-white">
                                                        {appointment.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-barber-blue">{appointment.clientName}</div>
                                                    <div className="text-sm text-barber-gray">{appointment.service}</div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-barber-gray">
                                                Duração: {appointment.duration} minutos
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            )}

            {isAdmin && (
                <DashboardLayout sidebar={<AdminSidebar />} title={'title="Agenda de Atendimentos"'}>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-barber-blue">Agenda</h1>
                                <p className="text-barber-gray">Gerencie todos os horários e agendamentos</p>
                            </div>

                            <Button className="bg-barber-blue hover:bg-barber-blue-light">
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Agendamento
                            </Button>
                        </div>
                    </div>
                </DashboardLayout>
            )}
        </main>
    );
};

export default Agenda;