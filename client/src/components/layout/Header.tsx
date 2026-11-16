
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Bell, Settings, Mail, MessageCircle, Instagram, Linkedin, Facebook } from "lucide-react";
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
      <div className="hidden md:flex items-center justify-end gap-4 border-b bg-eregulariza-surface px-4 py-1.5 text-xs text-eregulariza-gray sm:px-6 lg:px-8">
        <a href="mailto:falecom@e-regulariza.com" className="flex items-center gap-1.5 hover:text-eregulariza-primary">
          <Mail className="h-3.5 w-3.5" />
          falecom@e-regulariza.com
        </a>
        <a
          href="https://wa.me/5521999011999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-eregulariza-primary"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Fale no WhatsApp
        </a>
        <div className="flex items-center gap-3 border-l pl-4">
          <a href="https://www.facebook.com/eregulariza" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-eregulariza-primary">
            <Facebook className="h-3.5 w-3.5" />
          </a>
          <a href="https://www.instagram.com/e_regulariza" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-eregulariza-primary">
            <Instagram className="h-3.5 w-3.5" />
          </a>
          <a href="https://www.linkedin.com/company/e-regulariza/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-eregulariza-primary">
            <Linkedin className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div className="container mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo variant="header" size="lg" />
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
              <Button variant="outline" size="lg" asChild className="hidden sm:flex border-eregulariza-primary text-eregulariza-primary hover:bg-eregulariza-primary hover:text-white">
                <Link to="/login">Área do Cliente</Link>
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
                  Área do Cliente
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
