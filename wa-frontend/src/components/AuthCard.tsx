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
import { apiService, type LoginRequest, type RegisterRequest } from "@/services/api"

interface AuthCardProps {
  onLoginSuccess: () => void;
}

export function AuthCard({ onLoginSuccess }: AuthCardProps) {
  const [tab, setTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    password: ""
  })

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: ""
  })
  const [confirmPassword, setConfirmPassword] = useState("")

  // Load demo credentials when switching to login tab
  useEffect(() => {
    if (tab === "login") {
      setLoginData({
        email: "demo@metazapp.com",
        password: "password"
      });
    }
    setError("");
  }, [tab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiService.login(loginData);
      if (response.success) {
        onLoginSuccess();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (registerData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.register(registerData);
      if (response.success) {
        onLoginSuccess();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
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
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <CardFooter className="flex-col gap-2 mt-6">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
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
              <form onSubmit={handleRegister}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="register-name">Name</Label>
                    <Input 
                      id="register-name" 
                      type="text" 
                      placeholder="John Doe" 
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button 
                type="submit" 
                className="w-full" 
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Register with Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}