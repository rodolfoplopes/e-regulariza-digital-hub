
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { AlertCircle } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, role } = useSupabaseAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  // Handle cooldown timer
  useEffect(() => {
    const storedCooldown = localStorage.getItem('loginCooldown');
    const storedAttempts = localStorage.getItem('loginAttempts');
    
    if (storedCooldown) {
      const expiryTime = parseInt(storedCooldown, 10);
      if (expiryTime > Date.now()) {
        setCooldownActive(true);
        setCooldownTimer(Math.ceil((expiryTime - Date.now()) / 1000));
      } else {
        localStorage.removeItem('loginCooldown');
      }
    }
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (cooldownActive && cooldownTimer > 0) {
      interval = window.setInterval(() => {
        setCooldownTimer(prev => {
          if (prev <= 1) {
            setCooldownActive(false);
            localStorage.removeItem('loginCooldown');
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownActive, cooldownTimer]);

  const activateCooldown = () => {
    const cooldownDuration = 5 * 60 * 1000; // 5 minutes
    const expiryTime = Date.now() + cooldownDuration;
    
    localStorage.setItem('loginCooldown', expiryTime.toString());
    setCooldownActive(true);
    setCooldownTimer(5 * 60); // 5 minutes in seconds
  };

  const handleFailedLogin = (errorMessage: string) => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());
    
    if (newAttempts >= 3) {
      activateCooldown();
      toast({
        variant: "destructive",
        title: "Muitas tentativas de login",
        description: "Por segurança, aguarde 5 minutos antes de tentar novamente.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: `${errorMessage}. Tentativa ${newAttempts} de 3.`,
      });
    }
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    localStorage.removeItem('loginAttempts');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (cooldownActive) {
      toast({
        variant: "destructive",
        title: "Aguarde para tentar novamente",
        description: `Por segurança, tente novamente em ${cooldownTimer} segundos.`,
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const { success, error } = await login(email, password);
      
      if (success) {
        resetLoginAttempts();
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para o dashboard...",
        });
        // Navigation will be handled by the useEffect hook
      } else {
        handleFailedLogin(error || "E-mail ou senha inválidos");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleFailedLogin("Erro inesperado durante o login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="w-16 h-16 rounded-full eregulariza-gradient flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-white text-2xl">e</span>
              </div>
              <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com seus dados para acessar sua conta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {cooldownActive && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Muitas tentativas de login</p>
                      <p className="text-sm">Por segurança, aguarde {cooldownTimer} segundos antes de tentar novamente.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={cooldownActive || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link to="/forgot-password" className="text-sm text-eregulariza-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={cooldownActive || isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button
                  type="submit"
                  className="w-full eregulariza-gradient hover:opacity-90"
                  disabled={cooldownActive || isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-center text-sm mt-4">
                  Não tem uma conta?{" "}
                  <Link to="/register" className="text-eregulariza-primary hover:underline">
                    Cadastre-se
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
