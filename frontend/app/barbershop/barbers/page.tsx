"use client";

import DashboardLayout from '../../_components/DashboardLayout';
import AdminSidebar from '../../_components/AdminSideBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../_components/shadcn/ui/card';
import { Button } from '../../_components/shadcn/ui/button';
import { Avatar, AvatarFallback } from '../../_components/shadcn/ui/avatar';
import { Badge } from '../../_components/shadcn/ui/badge';
import { UserPlus, Scissors, Star, Phone, Mail } from 'lucide-react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subYears } from 'date-fns';
import { Barber } from '@/app/_types/barber';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/_components/shadcn/ui/dialog';
import FormWrapper from '@/app/_components/form/FormWrapper';
import InputField from '@/app/_components/form/fields/InputField';
import DatePickerField from '@/app/_components/form/fields/DatePickerField';
import { MaskedInputField } from '@/app/_components/MaskedInputField';
import { useRouter } from 'next/navigation';
import { api } from '@/app/_services/api';
import { toast, Toaster } from 'sonner';

const formEmployeeSchema = z.object({
  name: z.string().min(6, { message: "Name must be a 6 characters" }).max(100, { message: "name must have a maximum of 100 characters." }),
  email: z.string().email({ message: "Email must be a valid email." }),
  birth: z.date({ message: "Invalid date." }).min(new Date('1900-12-01'), { message: "Birth must be a valid Date" }).max(subYears(new Date(), 18)),
  phone: z
    .string()
    .min(10, { message: "Phone must be at least 10 characters." })
    .max(17, { message: "phone must have a maximum of 17 characters." })
    .trim(),
  role: z.enum(["EMPLOYEE"]),
  barbershopId: z.string(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Contains at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Contains at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim()
});

type FormEmployeeData = z.infer<typeof formEmployeeSchema>;

const AdminBarbers = () => {
  const router = useRouter();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [user, setUser] = useState<Barber | null>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const formEmployee = useForm<FormEmployeeData>({
    resolver: zodResolver(formEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      birth: new Date(),
      phone: "",
      role: "EMPLOYEE",
      password: "AISJN#@$!iscn25376#@NIuncs(*#N",
      barbershopId: ""
    },
  });

  const onSubmitEmployee = async (data: FormEmployeeData) => {
    console.log("foi dispared papais");
    try {
      const response = await api.post("/employee/create", {
        ...data,
        phone: "+" + data.phone.replace(/\D/g, ""),
        barbershopId: user?.barbershopId
      });
      if (response.status === 201) {
        toast.info("Barbeiro criado com sucesso!")
        if (user) {
          fetchBarbers(user?.barbershopId);
        }
        formEmployee.reset();
        dialogCloseRef.current?.click();
      } else {
        toast.info("Erro ao cadastrar colaborador.")
      }
    } catch (error) {
      console.log("Erro ao cadastrar colaborador:", error);
      toast.info("Erro ao cadastrar colaborador.")
    }
  }

  const fetchBarbers = async (barbershopId: string) => {
    try {
      const response = await api.get(`/employee/search/all/${barbershopId}`);
      console.log(response)
      console.log(response.data)
      setBarbers(response.data);
    } catch (error) {
      console.log("Erro ao buscar informações dos Colaboradores:", error);
      toast.info("Erro ao buscar informações dos Colaboradores.")
    }
  }

  const fetchUser = async () => {
    try {
      const { data: authData } = await api.get("/auth/me");
      const { data: userData } = await api.get(`/employee/${authData.id}`);
      setUser(userData);
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
      fetchBarbers(user.barbershopId);
      formEmployee.setValue("barbershopId", user.barbershopId);
    }
  }, [user]);

  useEffect(() => {
    console.log(barbers)
  }, [barbers]);

  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      title="Gerenciamento de Barbeiros"
    >
      <Toaster />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-barber-blue">Barbeiros</h1>
            <p className="text-barber-gray">Gerencie a equipe de profissionais</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-barber-blue hover:bg-barber-blue-light">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Barbeiro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicione mais um Barbeiro</DialogTitle>
                <DialogDescription>Crie uma Conta de acesso para seu colaborador</DialogDescription>
              </DialogHeader>
              <div className='p-2'>
                <FormWrapper stylePlus='h-full' form={formEmployee} onSubmit={onSubmitEmployee} submitLabel="Cadastrar">
                  <InputField control={formEmployee.control} name="name" label="Nome" type="text" />
                  <InputField control={formEmployee.control} name="email" label="Email" type="email" />
                  <DatePickerField control={formEmployee.control} name="birth" label="Data de Nascimento" />
                  <MaskedInputField control={formEmployee.control} name="phone" label="Telefone" mask="+55 00 00000-0000" />
                </FormWrapper>
                <DialogClose asChild>
                  <button type='button' ref={dialogCloseRef} className='hidden' />
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 pr-4">
          <Card>
            <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Total de Barbeiros</CardTitle>
              <Scissors className="h-4 w-4 text-barber-blue" />
            </CardHeader>
            <CardContent className='p-3 pt-1'>
              <div className="text-2xl font-bold text-barber-blue">{barbers.length}</div>
              <p className="text-xs text-barber-gray">Profissionais ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
            </CardHeader>
            <CardContent className='p-3 pt-1'>
              <div className="text-2xl font-bold text-barber-blue">
                {!!barbers.length && (barbers.reduce((acc, barber) => acc + barber.totalServicesRealizeds, 0))}
                {!barbers.length && (0)}
                </div>
              <p className="text-xs text-barber-gray">este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-3 xl:gap-6 lg:h-[calc(100vh-55vh)] overflow-y-auto">
          {barbers.length === 0 && (
            <div className='p-6 flex items-center justify-center'>
              <p className='text-md text-barber-gray'>Você ainda não possui colaboradores.</p>
            </div>
          )}
          {barbers.map((barber) => (
            <Card key={barber.id} className="hover:shadow-lg transition-shadow flex flex-row items-center w-full">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-barber-blue">
                  <AvatarFallback className="bg-barber-blue text-white text-xl">
                    {barber.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-barber-blue">{barber.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 xl:p-6 w-full">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-barber-gray" />
                    <span>{barber.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-barber-gray" />
                    <span>{barber.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col justify-center items-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-barber-blue">{barber.totalServicesRealizeds}</div>
                    <div className="text-xs text-barber-gray">Serviços Realizados</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Agenda
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminBarbers;