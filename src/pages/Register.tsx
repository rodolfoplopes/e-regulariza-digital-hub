
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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cpfError, setCpfError] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateCPF = (cpf: string): boolean => {
    // Remove non-numeric characters
    const cpfClean = cpf.replace(/\D/g, '');
    
    // Check if length is 11
    if (cpfClean.length !== 11) {
      return false;
    }

    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1{10}$/.test(cpfClean)) {
      return false;
    }

    // Validate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfClean.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) {
      checkDigit = 0;
    }
    if (checkDigit !== parseInt(cpfClean.charAt(9))) {
      return false;
    }

    // Validate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfClean.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) {
      checkDigit = 0;
    }
    if (checkDigit !== parseInt(cpfClean.charAt(10))) {
      return false;
    }

    return true;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and format as ###.###.###-##
    const value = e.target.value.replace(/\D/g, "");
    setCpfError("");
    
    if (value.length <= 11) {
      let formattedValue = value;
      if (value.length > 3) {
        formattedValue = `${value.slice(0, 3)}.${value.slice(3)}`;
      }
      if (value.length > 6) {
        formattedValue = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
      }
      if (value.length > 9) {
        formattedValue = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
      }
      setCpf(formattedValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password
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
      // In a real implementation, we'd check if CPF already exists in the database
      // For this mock version, we'll simulate a check
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
      
      // Here we would create a hash of the CPF for storage
      // const cpfHash = await createCPFHash(cpf); // In a real implementation
      
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
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
