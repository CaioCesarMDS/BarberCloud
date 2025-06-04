import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/shadcn/ui/button";
import { karantina } from "./layout";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex">
          <Image src="/logo.png" alt="Barber logo" width={240} height={240} />
      </div>

      <div className="w-full flex flex-col items-center justify-center text-center px-6">
        <h1 className={`${karantina.className} text-blue text-4xl max-w-xl`}>
          Mais do que um corte. Uma experiência de respeito.
        </h1>

        <div className="flex gap-4 mt-6">
          <Link href="/signin">
            <Button>Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Cadastrar-se</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
