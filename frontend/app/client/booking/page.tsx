"use client";

import BarberCard from "@/app/_components/BarberCard";
import ClientSidebar from "@/app/_components/ClientSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";
import { SearchInput } from "@/app/_components/SearchInput";
import { api } from "@/app/_services/api";
import { Barbershop } from "@/app/_types/barbeshop";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [barbershops, setBarbershops] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchValue.trim()) {
        setBarbershops([]);
        setSearched(false);
        setIsLoading(false);
        return;
      }

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
          console.error("Error fetching barbershops:", error);
          setBarbershops([]);
        } finally {
          setIsLoading(false);
          setSearched(true);
        }
      };

      fetchBarbershops();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <DashboardLayout sidebar={<ClientSidebar />} title="Minha Área">
      <div className="mb-8">
        <SearchInput placeholder="Pesquise..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      {isLoading && <p className="text-muted-foreground">Procurando...</p>}

      {!isLoading && searched && barbershops.length === 0 && (
        <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
      )}

      {!isLoading && barbershops.length > 0 && (
        <div className="space-y-4">
          {barbershops.map((barbershop) => (
            <BarberCard key={barbershop} barbershop={barbershop} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
