"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./_components/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./_components/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./_components/shadcn/ui/tabs";

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
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-barber-blue">Acesso ao BarberCloud</CardTitle>
            <CardDescription>Faça login para acessar o sistema!</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="barbershop">Barbershop</TabsTrigger>
              </TabsList>

              <TabsContent value="client" className="space-y-4">
                <div
                  className="flex flex-row items-center justify-center gap-6
                p-12 bg-no-repeat bg-cover bg-center"
                >
                  <Link href="client/signin">
                    <Button>SignIn</Button>
                  </Link>
                  <Link href="client/signup">
                    <Button>SignUp</Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="barbershop" className="space-y-4">
                <div
                  className="flex flex-row items-center justify-center gap-6
                p-12 bg-[url(/barber-bg.gif)] bg-no-repeat bg-cover bg-center"
                >
                  <Link href="barbershop/signin">
                    <Button>SignIn</Button>
                  </Link>
                  <Link href="barbershop/signup">
                    <Button>SignUp</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
