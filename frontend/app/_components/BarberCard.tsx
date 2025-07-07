import { Barbershop } from "@/app/_types/barbeshop";
import { AxiosError } from "axios";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../_services/api";
import ClientDetails from "../_types/clientDetails";
import { Button } from "./shadcn/ui/button";
import { Card, CardContent } from "./shadcn/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shadcn/ui/dropdown-menu";

export default function BarberCard({ barbershop, client }: { barbershop: Barbershop; client: ClientDetails }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = async () => {
    try {
      const response = await api.post(`client/subscribe/${client.id}/on/${barbershop.id}`);
      if (response.status === 201) {
        console.log("Subscription successful:", response.data);
        setIsSubscribed(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during subscribe:", error);
        if (error.status === 400) {
          toast("Erro ao inscrever se na barbearia!");
        }
      }
    }
  };

  const unsubcribe = async () => {
    try {
      const response = await api.delete(`client/unsubscribe/${client.id}/on/${barbershop.id}`);
      if (response.status === 200) {
        setIsSubscribed(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during subscribe:", error);
        if (error.status === 400) {
          toast("Erro ao inscrever se na barbearia!");
        }
      }
    }
  };

  const verifySubscription = async () => {
    client.subscribeIn.map((sub) => {
      if (sub.barbershopId === barbershop.id) {
        setIsSubscribed(true);
      }
    });
  };

  useEffect(() => {
    verifySubscription();
  }, []);

  return (
    <Card className="w-full overflow-hidden mb-4 sm:max-w-md md:max-w-lg lg:max-w-xl">
      <CardContent className="flex items-center gap-6 p-4">
        <div className="w-32 h-32 relative flex-shrink-0">
          <Image
            src={barbershop.imageUrl}
            alt={`Imagem da barbearia ${barbershop.name}`}
            fill
            className="object-cover rounded-md"
            sizes="100vw"
          />
        </div>

        {/* Infos à direita */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold">{barbershop.name}</h2>
          {!isSubscribed && <Button onClick={subscribe}>Inscrever-se</Button>}
          {isSubscribed && (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                Inscrito <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Inscrição</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={unsubcribe}>Desincrever-se</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <p className="text-sm text-muted-foreground">
            Horário: {barbershop.timeOpen} – {barbershop.timeClose}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
