import { Barbershop } from "@/app/_types/barbeshop";
import Image from "next/image";
import { Card, CardContent } from "./shadcn/ui/card";

export default function BarberCard({ barbershop }: { barbershop: Barbershop }) {
  return (
    <Card className="w-full overflow-hidden mb-4">
      <CardContent className="flex items-center gap-6 p-4">
        {/* Imagem à esquerda */}
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
        <div className="flex flex-col gap-20">
          <h2 className="text-lg font-semibold">{barbershop.name}</h2>
          <p className="text-sm text-muted-foreground">
            Horário: {barbershop.timeOpen} – {barbershop.timeClose}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
