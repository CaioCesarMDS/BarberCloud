'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../_components/DashboardLayout';
import ClientSidebar from '../../_components/ClientSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Badge } from '../../_components/shadcn/ui/badge';
import { Avatar, AvatarFallback } from '../../_components/shadcn/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../_components/shadcn/ui/select';
import { Calendar, Clock, Star, DollarSign, Download, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/_services/api';
import { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner';
import { Scheduling } from '@/app/_types/scheduling';
import Decimal from 'decimal.js';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/_components/shadcn/ui/dialog';

const ClientHistory = () => {
    const router = useRouter();

    interface User {
        id: string;
        name: string;
    }

    const [user, setUser] = useState<User | null>(null);
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
    const [totalSpent, setTotalSpent] = useState<Decimal>(new Decimal(0));
    const isFirstRender = useRef(true)

    const fetchAllSchedulings = async (clientId: string) => {
        const res = await api.get(`/scheduling/all/client/`, { params: { clientId: clientId } });
        setSchedulings(res.data);
    }

    const fetchUser = async () => {
        try {
            const { data: authData } = await api.get("/auth/me");
            const { data: userData } = await api.get(`/client/${authData.id}`);
            setUser(userData);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log("Error during get user:", error);
                if (error.status === 400) {
                    toast("Erro ao buscar informações do usuário!");
                }
            }
            router.push("/client/signin");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("barber-token");
        if (!token) {
            router.push("/client/signin");
            return;
        }

        fetchUser();
    }, [router]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (user) {
            fetchAllSchedulings(user?.id);
        }
    }, [user]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setTotalSpent(schedulings.filter((scheduling) => scheduling.status === 'DONE').reduce((acc, scheduling) => acc.plus(new Decimal(scheduling.totalPrice)), new Decimal(0)));

    }, [schedulings]);

    // const averageRating = schedulings.reduce((acc, service) => acc + service.rating, 0) / schedulings.length;
    const favoriteBarber = 'João Santos'; // Poderia ser calculado baseado na frequência

    function getStatusColor(status: string) {
        switch (status) {
            case "PENDING":
                return "bg-yellow-200 text-yellow-800";
            case "DONE":
                return "bg-green-200 text-green-800";
            case "CANCEL":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    }

    return (
        <DashboardLayout
            sidebar={<ClientSidebar />}
            title="Histórico de Atendimentos"
        >
            <Toaster />
            <div className="space-y-2 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-barber-blue">Meu Histórico</h1>
                        <p className="text-sm md:text-md text-barber-gray">Acompanhe todos os seus atendimentos realizados</p>
                    </div>

                    <div className="flex gap-2">
                        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
                            <Calendar className="h-4 w-4 text-barber-blue" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-barber-blue">{schedulings.filter((scheduling) => scheduling.status === 'DONE').length}</div>
                            <p className="text-xs text-barber-gray">atendimentos realizados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-barber-blue">R$ {totalSpent.toFixed(2).toString()}</div>
                            <p className="text-xs text-barber-gray">valor total gasto</p>
                        </CardContent>
                    </Card>

                    {/* 
                    Podemo até implementar avaliação dps
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                            <Star className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-barber-blue">{averageRating.toFixed(1)}</div>
                            <p className="text-xs text-barber-gray">⭐ suas avaliações</p>
                        </CardContent>
                    </Card> */}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Barbeiro Favorito</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-barber-blue">{favoriteBarber}</div>
                            <p className="text-xs text-barber-gray">mais frequente</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Service History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-barber-blue">Histórico Detalhado</CardTitle>
                        <CardDescription>
                            Lista completa de todos os seus atendimentos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-4 h-full h-[calc(100vh-495px)] sm:h-[calc(100vh-455px)] lg:h-[calc(100vh-425px)] overflow-y-auto">
                        {schedulings.map((scheduling) => (
                            <div key={scheduling.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Service Info */}
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-12 w-12 border-2 border-barber-blue">
                                            <AvatarFallback className="bg-barber-blue text-white">
                                                {scheduling.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="font-semibold text-barber-blue">{scheduling.barbershopName}</div>
                                            <div className="text-sm text-barber-gray">{scheduling.employeeName}</div>
                                            <div className="flex items-center space-x-2 text-sm text-barber-gray">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(scheduling.dateTime).toLocaleDateString('pt-BR')}</span>
                                                <Clock className="h-3 w-3 ml-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price and Status */}
                                    <div className="flex items-center space-x-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-600">R$ {parseFloat(scheduling.totalPrice).toFixed(2).toString()}</div>
                                            <Badge className={getStatusColor(scheduling.status)}>
                                                {scheduling.status}
                                            </Badge>
                                        </div>

                                        {/* 
                                            Talvez se implementar avaliação
                                            <div className="text-center">
                                                <div className="text-yellow-500 text-lg">
                                                    {getStars(service.rating)}
                                                </div>
                                                <div className="text-xs text-barber-gray">{service.rating}/5</div>
                                            </div> */}
                                    </div>
                                </div>

                                {/* Review
                                    
                                    Talvez se implementar avaliação
                                    {service.review && (
                                        <div className="mt-3 p-3 bg-barber-gray-light rounded-lg">
                                            <div className="flex items-start space-x-2">
                                                <MessageSquare className="h-4 w-4 text-barber-gray mt-0.5" />
                                                <div>
                                                    <div className="text-sm font-medium text-barber-blue">Sua Avaliação:</div>
                                                    <div className="text-sm text-barber-gray">{service.review}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    */}

                                {/* Actions */}
                                <div className="flex gap-2 mt-3">
                                    {scheduling.status !== 'PENDING' && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    Reagendar
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deseja Reageandar este Serviço?</DialogTitle>
                                                    <DialogDescription>Confirmando voçê reagendará o mesmo serviço mudando apenas a data e hora.</DialogDescription>
                                                </DialogHeader>
                                                <div className='p-4'>
                                                    
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline" size="sm">
                                                            Fechar
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            Reagendar
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Ver Detalhes
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Detalhes de seu agendamento</DialogTitle>
                                                <DialogDescription>Verifique os detalhes do seu agendamento.</DialogDescription>
                                            </DialogHeader>
                                            <Card className="rounded-xl shadow-md border border-gray-200 h-[calc(100vh-30vh)] overflow-y-auto">
                                                <CardHeader className="bg-gray-50 rounded-t-xl px-5 py-4">
                                                    <CardTitle className="text-lg font-semibold text-barber-black">
                                                        {scheduling.barbershopName}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm text-gray-500">
                                                        Agendamento por <span className="font-medium text-gray-700">{scheduling.clientName}</span>
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className="px-5 py-4 space-y-4">
                                                    <div className="space-y-2 text-sm text-gray-700">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Barbeiro:</span>
                                                            <span className="font-medium">{scheduling.employeeName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Cliente:</span>
                                                            <span className="font-medium">{scheduling.clientName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">ID do Agendamento:</span>
                                                            <span className="text-xs text-gray-400">{scheduling.id}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-2">
                                                        <p className="text-sm font-medium text-gray-600">Serviços:</p>
                                                        {scheduling.services.map((service) => (
                                                            <div
                                                                key={service.id}
                                                                className="flex items-center justify-between border-b pb-2 text-sm"
                                                            >
                                                                <span className="text-gray-700">{service.name}</span>
                                                                <span className="font-semibold text-green-600">
                                                                    R$ {parseFloat(service.price).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-500 gap-4 pt-4 border-t">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{new Date(scheduling.dateTime).toLocaleDateString('pt-BR')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{new Date(scheduling.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-center pt-4 border-t">
                                                        <p className="text-sm text-gray-700">Valor Total</p>
                                                        <div className="text-xl font-bold text-green-600">
                                                            R$ {parseFloat(scheduling.totalPrice).toFixed(2)}
                                                        </div>
                                                        <Badge className={`mt-2 ${getStatusColor(scheduling.status)}`}>
                                                            {scheduling.status}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline" size="sm">
                                                        Fechar
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}


                        {/* Load More
                        <div className="text-center mt-6">
                            <Button variant="outline">
                                Carregar Mais Atendimentos
                            </Button>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ClientHistory;
