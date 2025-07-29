'use client';

import AdminSidebar from '@/app/_components/AdminSideBar';
import { CurrencyInputMasked } from '@/app/_components/CurrencyInputMasked';
import DashboardLayout from '@/app/_components/DashboardLayout';
import InputField from '@/app/_components/form/fields/InputField';
import FormWrapper from '@/app/_components/form/FormWrapper';
import { Button } from '@/app/_components/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/shadcn/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/_components/shadcn/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/_components/shadcn/ui/table';
import { api } from '@/app/_services/api';
import Service from '@/app/_types/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, DollarSign, Scissors, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import z from 'zod';

const formNewServiceSchema = z
    .object({
        name: z.string().min(4, { message: "Be at least 4 characters long." }),
        description: z.string().min(20, { message: "Be at least 20 characters long." }),
        price: z.number(),
    });

type FormNewServiceData = z.infer<typeof formNewServiceSchema>;

const AdminServices = () => {
    const router = useRouter();

    interface Admin {
        id: string;
        name: string;
        email: string;
        phone: string;
        barbershopId: string;
        role: "ADMIN";
    }

    const [mostPopular, setMostPopular] = useState<Service | null>(null);
    const [showNewService, setShowNewService] = useState<boolean>(false);
    const [showEditService, setShowEditService] = useState<boolean>(false);
    const [editService, setEditService] = useState<Service | null>(null);
    const [showDeleteService, setShowDeleteService] = useState<boolean>(false);
    const [deleteService, setDeleteService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [totalServices, setTotalServices] = useState<number>(0);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const isFirstRender = useRef(true)

    const formNewService = useForm<FormNewServiceData>({
        resolver: zodResolver(formNewServiceSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
        },
    });

    const createService = async (data: FormNewServiceData): Promise<void> => {
        try {
            const response = await api.post(`/services/create`,
                {
                    ...data,
                    barbershopId: admin?.barbershopId,
                    price: data.price.toString(),
                }
            );

            if (response.status === 201) {
                toast.info('Serviço criado com sucesso!')
                fetchServices();
            }
        } catch (error) {
            toast.info('Erro ao criar o serviço!')
            console.log("Erro ao criar o serviço!:", error);
        }
    }

    const updateService = async (data: FormNewServiceData) => {
        try {
            const response = await api.put(`/services/${editService?.id}`,
                {
                    ...data,
                    price: data.price.toString(),
                }
            );

            if (response.status === 200) {
                toast.info('Serviço Atualizado com sucesso!')
                fetchServices();
            }
        } catch (error) {
            toast.info('Erro ao atualizar o serviço!')
            console.log("Erro ao atualizar o serviço!", error);
        }
        formNewService.reset();
        setShowEditService(false);
    }

    const execDeleteService = async (id: number) => {
        try {
            const response = await api.delete(`/services/${editService?.id}`);

            if (response.status === 200) {
                toast.info('Serviço Deletado com sucesso!')
                fetchServices();
            }
        } catch (error) {
            toast.info('Erro ao deletar o serviço!')
            console.log("Erro ao deletar o serviço!", error);
        }
        setDeleteService(null)
    }

    const fetchUser = async () => {
        try {
            const { data: authData } = await api.get("/auth/me");
            const { data: userData } = await api.get(`/employee/${authData.id}`);
            setAdmin(userData);
        } catch (error) {
            console.log("Erro ao buscar informações do usuário:", error);
            router.push("/barbershop/signin");
        }
    };

    const fetchServices = async () => {
        try {
            const { data: servicesData } = await api.get(`/services/all/${admin?.barbershopId}`);
            const { data: total } = await api.get(`/services/count/${admin?.barbershopId}`);
            const { data: service } = await api.get(`/services/most-popular/query`, { params: {barbershopId: admin?.barbershopId} });
            setServices(servicesData);
            setTotalServices(total);
            console.log(service);
            setMostPopular(service);
        } catch (error) {
            console.log("Erro ao buscar serviços:", error);
            toast.error("Erro ao buscar serviços");
        }
    }

    const execAndCloseDialog = (data: FormNewServiceData) => {
        setShowNewService(false);
        createService(data);
        formNewService.reset();
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
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetchServices();
    }, [admin]);

    useEffect(() => {
        if (editService) {
            formNewService.setValue('name', editService?.name);
            formNewService.setValue('description', editService?.description);
            formNewService.setValue('price', parseFloat(editService?.price));
        }
    }, [editService]);

    return (
        <DashboardLayout
            sidebar={<AdminSidebar />}
            title="Gerenciamento de Serviços"
        >
            <Toaster />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-barber-blue">Serviços</h1>
                        <p className="text-barber-gray">Gerencie os serviços oferecidos pela barbearia</p>
                    </div>

                    <Button onClick={() => setShowNewService(true)} className="bg-barber-blue hover:bg-barber-blue-light">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Serviço
                    </Button>
                </div>

                <Dialog open={showNewService} onOpenChange={setShowNewService}>
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Novo serviço</DialogTitle>
                            <DialogDescription>Cadastre o novo serviço de sua barbearia.</DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <FormWrapper
                                form={formNewService}
                                onSubmit={execAndCloseDialog}
                                submitLabel="Cadastrar"
                                stylePlus="pt-2"
                            >
                                <div className="flex flex-col gap-4">
                                    <InputField control={formNewService.control} name="name" label="Nome do Serviço" type="text" />
                                    <InputField control={formNewService.control} name="description" label="Descrição" type="text" />
                                    <CurrencyInputMasked control={formNewService.control} name="price" label="Preço" />
                                </div>
                            </FormWrapper>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
                            <Scissors className="h-4 w-4 text-barber-blue" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-barber-blue">{totalServices}</div>
                            <p className="text-xs text-barber-gray">Serviços ativos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-barber-blue">

                                R$ {!services.length && ("0")}
                                {!!services.length && (services.reduce((acc, service) => acc + parseFloat(service.price), 0) / totalServices).toFixed(2)}
                            </div>
                            <p className="text-xs text-barber-gray">Valor médio dos serviços</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mais Popular</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!mostPopular && (
                                <>
                                    <div className="text-lg font-bold text-barber-blue">Nenhum</div>
                                    <p className="text-xs text-barber-gray">Você não ainda não tem agendamentos</p>
                                </>
                            )}
                            {mostPopular && (
                                <>
                                    <div className="text-lg font-bold text-barber-blue">{mostPopular.name}</div>
                                    <p className="text-xs text-barber-gray">Mais popular entre seus clientes</p>
                                </>
                            )}
                            
                        </CardContent>
                    </Card>
                </div>

                {/* Services Table */}
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle>Lista de Serviços</CardTitle>
                        <CardDescription>
                            Todos os serviços disponíveis na barbearia
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='h-[calc(100vh-75vh)] overflow-y-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Serviço</TableHead>
                                    <TableHead>Preço</TableHead>
                                    {/* 
                                    é bom implementar isso aqui talvez ?
                                    <TableHead>Status</TableHead> 
                                    */}
                                    <TableHead className="w-[100px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!services.length && (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <p className="font-medium text-lg text-barber-gray text-center">Sua Barbearia não tem nenhum serviço cadastrado.</p>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell align='center'>
                                            <div>
                                                <div className="font-medium text-barber-blue">{service.name}</div>
                                                <div className="text-sm text-barber-gray">{service.description}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-green-600">
                                                R$ {parseFloat(service.price).toFixed(2)}
                                            </span>
                                        </TableCell>
                                        {/* 
                                        Status na tabela. implement talvez ?
                                        <TableCell>
                                            <Badge
                                                variant="default"
                                                className="bg-green-100 text-green-800"
                                            >
                                                {service.status}
                                            </Badge>
                                        </TableCell> */}
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button onClick={() => {
                                                    setEditService(service);
                                                    setShowEditService(true);
                                                }}
                                                    variant="ghost"
                                                    size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => {
                                                    setDeleteService(service);
                                                    setShowDeleteService(true);
                                                }}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600 hover:text-red-800">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={showEditService} onOpenChange={setShowEditService}>
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edite o serviço</DialogTitle>
                            <DialogDescription>Edite serviço de sua barbearia.</DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <FormWrapper
                                form={formNewService}
                                onSubmit={updateService}
                                submitLabel="Salvar"
                                stylePlus="pt-2"
                            >
                                <div className="flex flex-col gap-4">
                                    <InputField control={formNewService.control} name="name" label="Nome do Serviço" type="text" />
                                    <InputField control={formNewService.control} name="description" label="Descrição" type="text" />
                                    <CurrencyInputMasked control={formNewService.control} name="price" label="Preço" />
                                </div>
                            </FormWrapper>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showDeleteService} onOpenChange={setShowDeleteService}>
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Deletar Serviço</DialogTitle>
                            <DialogDescription>Delete o Serviço de sua Barbearia.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <h3>
                                Você deseja realmente deletar o serviço <span className='text-red-600 font-bold'>{deleteService?.name}</span>
                            </h3>
                        </div>
                        <DialogClose asChild>
                            <div className="flex flex-row gap-6 items center justify-center">
                                <Button className='font-bold' onClick={() => { setDeleteService(null) }}>
                                    Cancelar
                                </Button>
                                <Button className='text-red-800 font-bold' onClick={() => { if (deleteService) { execDeleteService(deleteService.id) } }}>
                                    Deletar
                                </Button>
                            </div>
                        </DialogClose>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};

export default AdminServices;