import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/shadcn/ui/button";
import { karantina } from "./layout";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <header className="fixed top-0 left-0 z-10 px-4 py-2 flex items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Barber logo" width={60} height={60} />
        </Link>
      </header>

      <div className="w-full flex flex-col items-center justify-center text-center px-6">
        <h1 className={`${karantina.className} text-white text-4xl max-w-xl mt-4`}>
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
