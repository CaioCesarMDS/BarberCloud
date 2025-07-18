"use client";

import EditableField from "@/app/_components/InputEdit";
import InputEditPassword, { FormPasswordData } from "@/app/_components/InputEditPassword";
import eventBus from "@/app/_lib/eventBus";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import ClientSidebar from "../../_components/ClientSideBar";
import DashboardLayout from "../../_components/DashboardLayout";
import { api, updatePassword } from "../../_services/api";

const ClientDashboard: React.FC = () => {
  const router = useRouter();

  interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    birth: Date;
  }

  const [user, setUser] = useState<User | null>(null);

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

  const updateUser = (valueToUpdate: Partial<User>) => {
    api.put(`/client/${user?.id}`, valueToUpdate);
  };

  const editPassword = async (data: FormPasswordData) => {
    try {
      const responseGet = await api.get(`/client?email=${user?.email}`);
      if (responseGet.status === 200) {
        const responseUpdate = await updatePassword.put(`/client/${responseGet.data.id}`, {
          password: data.password,
        });
        if (responseUpdate.status === 200) {
          toast("Password was changed!");
        }
      } else {
        toast("The email was sent is invalid!", {
          description: "Send a valid email.",
          action: {
            label: "Ok",
            onClick: () => console.log("send a valid email."),
          },
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast("error in update password!", {
          description: error?.message,
          action: {
            label: "Ok",
            onClick: () => console.log(error),
          },
        });
      }
    }
  };

  if (user) {
    return (
      <DashboardLayout sidebar={<ClientSidebar />} title="Suas Configurações">
        <Toaster />
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-[85vw] bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-4 text-white">
            <h1 className="text-2xl font-bold mb-2 w-fit">{`Perfil`}</h1>
          </div>
          <div className="w-[85vw] rounded-xl p-2 shadow-xs flex justify-center flex-wrap items-center gap-4">
            <EditableField
              label="Nome de usuário"
              value={user?.name || ""}
              phone={false}
              email={false}
              onSave={(newVal) => {
                updateUser({ name: newVal });
                eventBus.emit("profileUpdated");
              }}
            />

            <EditableField
              label="Email"
              value={user?.email || ""}
              phone={false}
              email={false}
              onSave={(newVal) => {
                updateUser({ email: newVal });
              }}
            />

            <EditableField
              label="Telefone"
              value={user?.phone || ""}
              phone={true}
              email={false}
              onSave={(newVal) => {
                updateUser({ phone: newVal.replace(/\D/g, "") });
              }}
            />

            <InputEditPassword label="Senha" onSubmitPassword={(data: FormPasswordData) => editPassword(data)} />
          </div>
          <div className="w-[85vw] bg-gradient-to-r from-barber-blue to-barber-blue-light rounded-xl p-4 text-white">
            <h1 className="w-fit text-2xl font-bold mb-2">{`Configurações da conta`}</h1>
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export default ClientDashboard;
