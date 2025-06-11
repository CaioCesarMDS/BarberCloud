"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("client/dashboard");
  }, [router]);

  return null;
}
