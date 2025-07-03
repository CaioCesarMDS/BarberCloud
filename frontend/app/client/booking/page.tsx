"use client";

import BarberCard from "@/app/_components/BarberCard";
import ClientSidebar from "@/app/_components/ClientSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";
import { SearchInput } from "@/app/_components/SearchInput";
import { api } from "@/app/_services/api";
import { Barbershop } from "@/app/_types/barbeshop";
import ClientDetails from "@/app/_types/clientDetails";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [barbershops, setBarbershops] = useState([]);
  const [client, setClient] = useState<ClientDetails | null>(null);


  const fetchUser = async () => {
    try {
      const { data: authData } = await api.get("/auth/me");
      const { data: userData } = await api.get(`/client/details/${authData.id}`);
      setClient(userData);
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

  return client ? (
    <DashboardLayout sidebar={<ClientSidebar />} title="Minha Área">
      <div className="mb-8 sm:max-w-md md:max-w-lg lg:max-w-xl">
        <SearchInput placeholder="Pesquise..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      {isLoading && <p className="text-muted-foreground">Procurando...</p>}

      {!isLoading && searched && barbershops.length === 0 && (
        <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
      )}

      {!isLoading && barbershops.length > 0 && (
        <div className="space-y-4">
          {barbershops.map((barbershop) => (
            <BarberCard key={barbershop} barbershop={barbershop} client={client} />
          ))}
        </div>
      )}
    </DashboardLayout>
  ) : <div className="mb-8 sm:max-w-md md:max-w-lg lg:max-w-xl"><h1>Redirect ...</h1></div>
}
