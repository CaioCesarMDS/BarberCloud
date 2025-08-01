"use client";

import BarberCard from "@/app/_components/BarberCard";
import ClientSidebar from "@/app/_components/ClientSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";
import { SearchInput } from "@/app/_components/SearchInput";
import SubscribedBarberCard from "@/app/_components/SubscribedBarberCard";
import { Card, CardHeader, CardContent, CardTitle } from "@/app/_components/shadcn/ui/card";
import { api } from "@/app/_services/api";
import { Barbershop } from "@/app/_types/barbershop";
import ClientDetails from "@/app/_types/clientDetails";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SubscribedBarbershop extends Barbershop {
  subscribeIn: string;
}

export default function BarbershopsPage() {
  const router = useRouter();

  const [subscribedBarbershops, setSubscribedBarbershops] = useState<SubscribedBarbershop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [client, setClient] = useState<ClientDetails | null>(null);

  const fetchUser = async () => {
    try {
      const { data: authData } = await api.get("/auth/me");
      const { data: userData } = await api.get(`/client/details/${authData.id}`);
      setClient(userData);
      fetchUserSubscriptions(authData.id);
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

  const fetchUserSubscriptions = async (clientId: string) => {
    try {
      const { data } = await api.get(`/client/${clientId}/subscriptions`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: SubscribedBarbershop[] = data.map((item: any) => ({
        id: item.barbershopId,
        name: item.name,
        imageUrl: item.imageUrl,
        timeOpen: item.timeOpen,
        timeClose: item.timeClose,
        subscribeIn: item.subscribeIn,
      }));

      console.log("Mapped barbershops:", mapped);
      setSubscribedBarbershops(mapped);
    } catch (error) {
      console.error("Erro ao buscar barbearias inscritas:", error);
      toast("Erro ao buscar barbearias inscritas!");
    }
  };

  const fetchBarbershops = async () => {
    try {
      setIsLoading(true);
      setSearched(false);

      const response = await api.get("/barbershop/search/all", {
        params: { name: searchValue },
      });

      const mapped = response.data.map((barbershop: Barbershop) => ({
        id: barbershop.id,
        name: barbershop.name,
        imageUrl: barbershop.imageUrl,
        timeOpen: barbershop.timeOpen,
        timeClose: barbershop.timeClose,
      }));

      setBarbershops(mapped);
    } catch (error) {
      console.log("Error fetching barbershops:", error);
      setBarbershops([]);
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("barber-token");
    if (!token) {
      router.push("/client/signin");
      return;
    }

    fetchUser();

    const timeout = setTimeout(() => {
      if (!searchValue.trim()) {
        setBarbershops([]);
        setSearched(false);
        setIsLoading(false);
        return;
      }

      fetchBarbershops();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue, router]);

  const handleUnsubscribe = async (barbershopId: string) => {
    console.log("Unsubscribing from barbershop:", barbershopId);
    try {
      await api.delete(`/client/unsubscribe/${client?.id}/on/${barbershopId}`);
      toast("Inscrição cancelada com sucesso!");
      setSubscribedBarbershops((prev) => prev.filter((b) => b.id !== barbershopId));
    } catch (error) {
      console.error("Erro ao desinscrever:", error);
      toast("Erro ao cancelar inscrição.");
    }
  };

  return client ? (
    <DashboardLayout sidebar={<ClientSidebar />} title="Suas Inscrições">
      <div className="h-full w-full grid justify-center md:grid md:grid-cols-2 md:p-4 gap-2">
        <Card className="p-1 w-[calc(100vw-6vw)] sm:w-[calc(100vw-10vw)] md:w-[calc(100vw-60vw)] lg:w-[calc(100vw-65vw)]">
          <CardHeader className="p-2">
            <div className="w-full mb-8">
              <SearchInput placeholder="Pesquise..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-1 h-[calc(100vh-40vh)] md:p-4 overflow-y-auto">
            {isLoading && <p className="text-muted-foreground">Procurando...</p>}

            {!isLoading && searched && barbershops.length === 0 && (
              <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
            )}

            {!isLoading && barbershops.length > 0 && (
              <div className="space-y-4">
                {barbershops.map((barbershop) => (
                  <BarberCard
                    key={barbershop.id}
                    barbershop={barbershop}
                    client={client}
                    onSubscribeSuccess={() => fetchUserSubscriptions(client.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="p-1 w-[calc(100vw-6vw)] sm:w-[calc(100vw-10vw)] md:w-[calc(100vw-60vw)] lg:w-[calc(100vw-65vw)]">
          <CardHeader>
            <CardTitle className="text-barber-blue text-2xl">Suas barbearias</CardTitle>
          </CardHeader>
          <CardContent className="p-1 h-full h-[calc(100vh-40vh)] md:p-4 overflow-y-auto">
            {subscribedBarbershops.length > 0 && (
              <div className="space-y-4 mb-6">
                {subscribedBarbershops.map((barbershop) => (
                  <SubscribedBarberCard
                    key={`${barbershop.id}-${barbershop.subscribeIn}`}
                    barbershop={barbershop}
                    onUnsubscribe={handleUnsubscribe}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </DashboardLayout>
  ) : (
    <div className="mb-8 sm:max-w-md md:max-w-lg lg:max-w-xl">
      <h1>Redirect ...</h1>
    </div>
  );
}
