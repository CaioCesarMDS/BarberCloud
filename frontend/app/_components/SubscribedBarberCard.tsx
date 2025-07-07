import { Barbershop } from "@/app/_types/barbeshop";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./shadcn/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shadcn/ui/dropdown-menu";

interface Props {
  barbershop: Barbershop;
  onUnsubscribe: (barbershopId: string) => void;
}

export default function SubscribedBarberCard({ barbershop, onUnsubscribe }: Props) {
  const router = useRouter();

  const goToBarbershop = () => {
    router.push(`/client/barbershop/${barbershop.id}`);
  };
  return (
    <Card className="w-full overflow-hidden mb-4 sm:max-w-md md:max-w-lg lg:max-w-xl" onClick={goToBarbershop}>
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
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold">{barbershop.name}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors">
              Inscrito <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Inscrição</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUnsubscribe(barbershop.id)}>Desinscrever-se</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-sm text-muted-foreground">
            Horário: {barbershop.timeOpen} - {barbershop.timeClose}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
