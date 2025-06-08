"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "./_components/shadcn/ui/card";

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
        <Card>
          <CardHeader className="items-center justify center">
            <div className="flex items-center">
              <h3>Are you ?</h3>
            </div>
            <div className="flex flex-row gap-2">
              <Button>Client</Button>
              <Button variant="outline">Barbershop</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <Link href="/client/signin">
                <Button>Sign In</Button>
              </Link>
              <Link href="/client/signup">
                <Button>Sing Up</Button>
              </Link>
            </div>
            <div className="hidden flex-col gap-6">
              <Link href="">
                <Button>Sign In</Button>
              </Link>
              <Link href="">
                <Button>Sing Up</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
