import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./shadcn/ui/button";
import { Card, CardContent } from "./shadcn/ui/card";

export default function Header() {
  return (
    <Card>
      <CardContent className="px-2 py-2 sm:px-5 sm:py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="IF Barber logo" width={50} height={50} />
        </Link>
        <Button variant="outline" size="icon">
          <MenuIcon size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}