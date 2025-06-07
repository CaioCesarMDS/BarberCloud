import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/shadcn/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <header className="fixed top-0 left-0 z-10 px-4 py-2 w-full">
        <Link href="/">
          <Image src="/logo.png" alt="Barber logo" width={80} height={80} />
        </Link>
      </header>
      <main>
        <div className="flex flex-col m-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to Barber Cloud</h1>
          <p className="text-lg  mb-6">A complete management system for your barber shop.</p>
        </div>
      </main>
      <div className="w-full flex flex-col items-center justify-center text-center px-6 text-black">
        <div className="flex gap-4 mt-6">
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
