import Link from "next/link";
import Header from "../_components/header";
import { Button } from "../_components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/shadcn/ui/card";
import { Input } from "../_components/shadcn/ui/input";
import { Label } from "../_components/shadcn/ui/label";

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grid place-items-center flex-1">
        <Card className="w-11/12 max-w-md">
          <CardHeader className="text-2xl">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Button>Enter</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
