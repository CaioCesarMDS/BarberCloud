"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../_components/shadcn/ui/card";
import api from "../services/api";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("barber-token");

    if (!token) {
      router.push("/signin");
    }

    const validateToken = async () => {
      try {
        await api.get("/auth/me");
      } catch (err) {
        console.error("Token inválido ou expirado:", err);
        localStorage.removeItem("barber-token");
        router.push("/signin");
      }
    };

    validateToken();
  }, [router]);

  return (
    <main>
      <Card className="flex items-center justify-center p-6">
        <div>
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl">Welcome to</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4>Barbe IF</h4>
          </CardContent>
        </div>
        <div>
          <Image src="/barber.png" alt="Barber Logo" width={200} height={200} />
        </div>
      </Card>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
    </main>
  );
}
