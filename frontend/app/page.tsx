import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/shadcn/ui/button";
import { karantina } from "./layout";

export default function Home() {
  return (
    <div className="relative h-screen bg-home bg-cover bg-center">
      <header className="w-full absolute flex justify-between items-center top-0 left-0 z-10 p-4">
        <Image src="/logo.svg" alt="Barber logo" width={70} height={70} />
        <Button variant="outline" size="icon">
          <MenuIcon size={18} />
        </Button>
      </header>
      <div className="w-full absolute inset-0 bg-zinc-900/70 flex flex-col items-center justify-center text-center px-6">
        <h1 className={`${karantina.className} text-white text-4xl max-w-xl`}>
          Mais do que um corte. Uma experiência de respeito.
        </h1>
        <div className="flex gap-10">
          <Link href="/signin">
            <Button className="mt-6">
              Entrar
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="mt-6">
              Cadastrar-se
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
