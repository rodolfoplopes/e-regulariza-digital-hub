
import { useState } from "react";
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
import { createCPFHash, validateCPF, formatCPF } from "@/utils/userUtils";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cpfError, setCpfError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const getPasswordStrengthText = (): { text: string; color: string } => {
    if (passwordStrength === 0) return { text: "Muito fraca", color: "bg-red-500" };
    if (passwordStrength <= 2) return { text: "Fraca", color: "bg-red-500" };
    if (passwordStrength <= 3) return { text: "Média", color: "bg-yellow-500" };
    if (passwordStrength <= 4) return { text: "Forte", color: "bg-green-500" };
    return { text: "Muito forte", color: "bg-green-700" };
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and format as ###.###.###-##
    const value = e.target.value.replace(/\D/g, "");
    setCpfError("");
    
    if (value.length <= 11) {
      setCpf(formatCPF(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Por favor, insira um endereço de e-mail válido.",
      });
      return;
    }
    
    // Validate password strength
    if (passwordStrength < 3) {
      toast({
        variant: "destructive",
        title: "Senha muito fraca",
        description: "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.",
      });
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "As senhas não coincidem. Tente novamente.",
      });
      return;
    }
    
    // Validate CPF
    if (!cpf || !validateCPF(cpf)) {
      setCpfError("CPF inválido. Verifique o número inserido.");
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "CPF inválido. Verifique o número inserido.",
      });
      return;
    }

    setIsLoading(true);

    // Mock registration function - would be replaced with actual auth
    try {
      // In a real Supabase implementation, we'd check if CPF already exists in the database
      // For this mock version, we'll simulate a check
      const cpfHash = await createCPFHash(cpf);
      const emailExists = Math.random() > 0.9; // 10% chance of email already existing
      
      if (emailExists) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: "E-mail já cadastrado no sistema.",
        });
        setIsLoading(false);
        return;
      }
      
      // Simulate CPF check
      const cpfExists = Math.random() > 0.9; // 10% chance of CPF already existing
      
      if (cpfExists) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: "CPF já cadastrado no sistema.",
        });
        setIsLoading(false);
        return;
      }
      
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Redirecionando para o dashboard...",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Ocorreu um erro. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and format as (XX) XXXXX-XXXX
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      }
      if (value.length > 7) {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
      setPhone(formattedValue);
    }
  };

  const strength = getPasswordStrengthText();

  return (
    <Layout hideFooter>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="w-16 h-16 rounded-full eregulariza-gradient flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-white text-2xl">e</span>
              </div>
              <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para iniciar
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCPFChange}
                    required
                    className={cpfError ? "border-red-500" : ""}
                  />
                  {cpfError && (
                    <p className="text-xs text-red-500 mt-1">{cpfError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {password && (
                    <>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                        <div 
                          className={`h-full ${strength.color} transition-all duration-300`} 
                          style={{ width: `${(passwordStrength / 5) * 100}%` }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Força: {strength.text}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={confirmPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      {confirmPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {confirmPassword && password && (
                    confirmPassword === password ? (
                      <div className="flex items-center text-green-600 text-xs gap-1 mt-1">
                        <Check className="h-3 w-3" />
                        <span>As senhas coincidem</span>
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                    )
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button
                  type="submit"
                  className="w-full eregulariza-gradient hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
                <p className="text-center text-sm mt-4">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-eregulariza-primary hover:underline">
                    Fazer login
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
