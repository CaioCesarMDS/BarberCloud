import { Barbershop } from "@/app/_types/barbershop";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

interface Props {
  barbershop: Barbershop;
  onUnsubscribe: (barbershopId: string) => void;
}

export default function SubscribedBarberCard({ barbershop, onUnsubscribe }: Props) {
  const router = useRouter();

  const goToBarbeshop = () => {
    router.push(`/client/barbershop/${barbershop.id}`);
  };
  return (
    <Card className="w-full overflow-hidden mb-4 lg:max-w-lg 2xl:max-w-xl">
      <CardContent className="flex items-center gap-3 lg:gap-6 p-2 lg:p-4 mr-0">
        <div className="w-32 h-32 relative flex-shrink-0">
          <Image
            src={barbershop.imageUrl}
            alt={`Imagem da barbearia ${barbershop.name}`}
            fill
            className="object-cover rounded-md"
            sizes="100vw"
          />
        </div>
        <div className="flex flex-col gap-4 2xl:gap-6">
          <h2 className="text-md md:text-lg font-semibold">{barbershop.name}</h2>
          <div className="w-full flex flex-col 2xl:flex-row items-center gap-2 md:gap-4 2xl:gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 text-xs sm:text-sm xl:text-md w-full h-10 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors">
                Inscrito <ChevronDown className="w-5 h-5 xl:w-7 xl:h-7" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Inscrição</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onUnsubscribe(barbershop.id)}>Desinscrever-se</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={goToBarbeshop}
              className="px-4 py-2 text-xs md:text-sm xl:text-md h-10 w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors"
            >
              Agendar Horário
            </Button>
          </div>
          <p className="text-xs md:text-sm xl:text-md text-muted-foreground">
            Horário: {barbershop.timeOpen} - {barbershop.timeClose}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
