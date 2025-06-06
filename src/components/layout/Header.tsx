
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/brand/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Simulating logged-in state, will be replaced with actual auth
  const isLoggedIn = false;
  const user = { name: "João Silva", initials: "JS" };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo variant="header" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link 
            to="/" 
            className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/" ? "text-eregulariza-primary" : "text-eregulariza-gray hover:text-eregulariza-primary"}`}
          >
            Home
          </Link>
          <Link 
            to="/sobre" 
            className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/sobre" ? "text-eregulariza-primary" : "text-eregulariza-gray hover:text-eregulariza-primary"}`}
          >
            Sobre
          </Link>
          <Link 
            to="/servicos" 
            className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/servicos" ? "text-eregulariza-primary" : "text-eregulariza-gray hover:text-eregulariza-primary"}`}
          >
            Serviços
          </Link>
          <Link 
            to="/contato" 
            className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/contato" ? "text-eregulariza-primary" : "text-eregulariza-gray hover:text-eregulariza-primary"}`}
          >
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-eregulariza-secondary"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-eregulariza-primary text-white">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/configuracoes" className="w-full flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild className="hidden sm:flex border-eregulariza-primary text-eregulariza-primary hover:bg-eregulariza-primary hover:text-white">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" className="hidden sm:flex bg-eregulariza-primary hover:bg-eregulariza-primary/90 text-white">
                <Link to="/register" className="text-white">Cadastrar</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="sm:hidden">
                <Link to="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                location.pathname === "/" ? "bg-eregulariza-surface text-eregulariza-primary" : "text-eregulariza-gray hover:bg-eregulariza-surface"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/sobre"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                location.pathname === "/sobre" ? "bg-eregulariza-surface text-eregulariza-primary" : "text-eregulariza-gray hover:bg-eregulariza-surface"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/servicos"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                location.pathname === "/servicos" ? "bg-eregulariza-surface text-eregulariza-primary" : "text-eregulariza-gray hover:bg-eregulariza-surface"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              to="/contato"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                location.pathname === "/contato" ? "bg-eregulariza-surface text-eregulariza-primary" : "text-eregulariza-gray hover:bg-eregulariza-surface"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Button asChild className="bg-eregulariza-primary hover:bg-eregulariza-primary/90 text-white">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-eregulariza-primary text-eregulariza-primary hover:bg-eregulariza-primary/10">
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  Cadastrar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
