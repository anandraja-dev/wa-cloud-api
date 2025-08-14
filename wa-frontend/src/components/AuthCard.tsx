import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import loginData from "../login-data.json"

interface AuthCardProps {
  onLoginSuccess: () => void;
}

export function AuthCard({ onLoginSuccess }: AuthCardProps) {
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (tab === "login") {
      setEmail(loginData.email);
      setPassword(loginData.password);
    }
  }, [tab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === loginData.email && password === loginData.password) {
      onLoginSuccess();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tabs above card */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full rounded-b-md border-b-0">
          <TabsTrigger value="login" className={cn(
              "flex-1 rounded-md py-2 data-[state=active]:bg-black data-[state=active]:text-white"
            )} >
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className={cn(
              "flex-1 rounded-md py-2 data-[state=active]:bg-black data-[state=active]:text-white"
            )}>
            Register
          </TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login" className="mt-0 transition-all duration-300">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <CardFooter className="flex-col gap-2 mt-6">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Register Form */}
        <TabsContent value="register" className="mt-0 transition-all duration-300">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Create a new account</CardTitle>
              <CardDescription>
                Fill in the details to register a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Register
              </Button>
              <Button variant="outline" className="w-full">
                Register with Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
