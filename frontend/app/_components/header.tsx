import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./shadcn/ui/button";
import { Card, CardContent } from "./shadcn/ui/card";
// comentando pra o windows ver que eu mudei essa merda
export default function Header() {
  return (
    <Card>
      <CardContent className="px-5 py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="IF Barber logo" width={60} height={60} />
        </Link>
        <Button variant="outline" size="icon">
          <MenuIcon size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}
