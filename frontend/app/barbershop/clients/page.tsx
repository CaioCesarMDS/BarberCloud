"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../_components/DashboardLayout';
import BarberSidebar from '../../_components/BarberSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Input } from '../../_components/shadcn/ui/input';
import { Avatar, AvatarFallback } from '../../_components/shadcn/ui/avatar';
import { Badge } from '../../_components/shadcn/ui/badge';
import { Search, Phone, Mail, Calendar, User, MoreVertical, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/_services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/_components/shadcn/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/_components/shadcn/ui/dialog';
import { Label } from '@/app/_components/shadcn/ui/label';
import AdminSidebar from '@/app/_components/AdminSideBar';

const Clients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const clients = [
        {
            id: 1,
            name: 'João Silva',
            phone: '(11) 99999-9999',
            email: 'joao@email.com',
            lastVisit: '2024-01-15',
            totalVisits: 12,
            preferredService: 'Corte + Barba',
            notes: 'Prefere corte mais curto nas laterais'
        },
        {
            id: 2,
            name: 'Pedro Santos',
            phone: '(11) 88888-8888',
            email: 'pedro@email.com',
            lastVisit: '2024-01-10',
            totalVisits: 8,
            preferredService: 'Corte Masculino',
            notes: 'Cliente regular, sempre às quartas'
        },
        {
            id: 3,
            name: 'Carlos Lima',
            phone: '(11) 77777-7777',
            email: 'carlos@email.com',
            lastVisit: '2024-01-08',
            totalVisits: 5,
            preferredService: 'Barba',
            notes: 'Tem alergia a produtos com álcool'
        },
        {
            id: 4,
            name: 'Rafael Costa',
            phone: '(11) 66666-6666',
            email: 'rafael@email.com',
            lastVisit: '2024-01-05',
            totalVisits: 15,
            preferredService: 'Corte + Barba',
            notes: 'Cliente VIP, atendimento especial'
        }
    ];

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const router = useRouter();

    interface User {
        id: string;
        name: string;
        role: "ADMIN" | "EMPLOYEE";
    }

    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isBarber, setIsBarber] = useState<boolean>(false);

    const fetchUser = async () => {
        try {
            const { data: authData } = await api.get("/auth/me");
            const { data: userData } = await api.get(`/employee/${authData.id}`);
            setUser(userData);
            console.log(user)
            if (userData.role === "ADMIN") {
                setIsAdmin(true);
            } else if (userData.role === "EMPLOYEE") {
                setIsBarber(true);
            }
        } catch (error) {
            console.log("Erro ao buscar informações do usuário:", error);
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

    return (
        <main>
            {isAdmin && (
                <DashboardLayout
                    sidebar={<AdminSidebar />}
                    title="Gerenciamento de Clientes"
                >
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-barber-blue">Clientes</h1>
                                <p className="text-barber-gray">Gerencie todos os clientes da barbearia</p>
                            </div>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-barber-blue hover:bg-barber-blue-light">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Novo Cliente
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                                        <DialogDescription>
                                            Preencha as informações do cliente
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="name">Nome Completo</Label>
                                            <Input id="name" placeholder="Nome do cliente" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="email@exemplo.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefone</Label>
                                            <Input id="phone" placeholder="(11) 99999-9999" />
                                        </div>
                                        <Button className="w-full bg-barber-blue hover:bg-barber-blue-light">
                                            Cadastrar Cliente
                                        </Button>
                                        */}
                                        Talvez tenha um form aqui cria um cliente com senha aleatória e o cliente recebe um email pra criar sua senha.
                                    </div> 
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Search */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barber-gray h-4 w-4" />
                                    <Input
                                        placeholder="Buscar clientes por nome ou email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-barber-blue">1,247</div>
                                    <p className="text-xs text-barber-gray">+12% em relação ao mês anterior</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Clientes Inscritos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">1,156</div>
                                    <p className="text-xs text-barber-gray">92.7% do total</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Novos este Mês</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-barber-blue">42</div>
                                    <p className="text-xs text-barber-gray">+18% vs mês anterior</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Clients Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Lista de Clientes</CardTitle>
                                <CardDescription>
                                    Todos os clientes cadastrados na barbearia
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Contato</TableHead>
                                            <TableHead>Última Visita</TableHead>
                                            <TableHead>Total de Visitas</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-[70px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredClients.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar>
                                                            <AvatarFallback className="bg-barber-blue text-white">
                                                                {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium text-barber-blue">{client.name}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            <span>{client.email}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            <span>{client.phone}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-barber-gray" />
                                                        <span>{new Date(client.lastVisit).toLocaleDateString('pt-BR')}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-barber-gray-light text-barber-blue">
                                                        {client.totalVisits} visitas
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={'Ativo' === 'Ativo' ? 'default' : 'secondary'}
                                                        className={'Ativo' === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                                    >
                                                        {'Ativo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </DashboardLayout>
            )}

            {isBarber && (
                <DashboardLayout
                    sidebar={<BarberSidebar />}
                    title="Meus Clientes"
                >
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-barber-blue">Meus Clientes</h1>
                                <p className="text-barber-gray">Gerencie informações dos seus clientes</p>
                            </div>
                        </div>

                        {/* Search */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barber-gray h-4 w-4" />
                                    <Input
                                        placeholder="Buscar clientes por nome, telefone ou email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                                    <User className="h-4 w-4 text-barber-blue" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-barber-blue">{clients.length}</div>
                                    <p className="text-xs text-barber-gray">atendidos por você</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
                                    <Calendar className="h-4 w-4 text-barber-blue" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-barber-blue">
                                        {clients.reduce((acc, client) => acc + client.totalVisits, 0)}
                                    </div>
                                    <p className="text-xs text-barber-gray">total de serviços</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Média de Visitas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-barber-blue">
                                        {(clients.reduce((acc, client) => acc + client.totalVisits, 0) / clients.length).toFixed(1)}
                                    </div>
                                    <p className="text-xs text-barber-gray">por cliente</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Clients Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClients.map((client) => (
                                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="text-center pb-4">
                                        <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-barber-blue">
                                            <AvatarFallback className="bg-barber-blue text-white text-lg">
                                                {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="text-barber-blue text-lg">{client.name}</CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Contact Info */}
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Phone className="h-4 w-4 text-barber-gray" />
                                                <span>{client.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Mail className="h-4 w-4 text-barber-gray" />
                                                <span className="truncate">{client.email}</span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-2 text-center">
                                            <div>
                                                <div className="text-lg font-bold text-barber-blue">{client.totalVisits}</div>
                                                <div className="text-xs text-barber-gray">Visitas</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-barber-blue">
                                                    {new Date(client.lastVisit).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className="text-xs text-barber-gray">Última visita</div>
                                            </div>
                                        </div>

                                        {/* Preferred Service */}
                                        <div>
                                            <div className="text-sm font-medium text-barber-blue mb-1">Serviço Preferido</div>
                                            <Badge variant="secondary" className="w-full justify-center">
                                                {client.preferredService}
                                            </Badge>
                                        </div>

                                        {/* Notes */}
                                        {client.notes && (
                                            <div>
                                                <div className="text-sm font-medium text-barber-blue mb-1">Observações</div>
                                                <div className="text-sm text-barber-gray bg-barber-gray-light p-2 rounded">
                                                    {client.notes}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Agendar
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                Ver Histórico
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredClients.length === 0 && (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <User className="h-12 w-12 text-barber-gray mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-barber-blue mb-2">
                                        Nenhum cliente encontrado
                                    </h3>
                                    <p className="text-barber-gray">
                                        Tente ajustar os termos de busca ou verifique se há clientes cadastrados.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </DashboardLayout>
            )};
        </main>
    );
};

export default Clients;