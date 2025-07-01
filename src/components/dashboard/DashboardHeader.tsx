
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu, X, LogOut, Settings, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import ProcessNotifications from "../process/ProcessNotifications";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  const { user, profile, logout } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app with Supabase, we would fetch the custom logo URL
    // For now, we'll just use a mock implementation  
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error('Logout error in header:', error);
      // Force navigation even if logout fails
      navigate("/login", { replace: true });
    }
  };

  // Use profile data from Supabase auth
  const userData = profile || {
    name: user?.email || "Usuário",
    initials: user?.email?.substring(0, 2).toUpperCase() || "U",
    role: "Cliente",
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo 
              variant="header" 
              customUrl={logoUrl || undefined} 
            />
            {!isMobile && (
              <span className="font-semibold text-lg text-eregulariza-gray">
                e-regulariza
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <ProcessNotifications />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-eregulariza-primary text-white">
                    {userData.name.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-eregulariza-gray">{userData.name}</span>
                  <span className="text-xs text-eregulariza-description">{profile?.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/perfil" className="cursor-pointer flex w-full items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes" className="cursor-pointer flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
