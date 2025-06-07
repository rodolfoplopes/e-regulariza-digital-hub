
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bell, 
  Settings,
  User,
  X,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function MobileNav({ isOpen, onClose }: { isOpen: boolean, onClose?: () => void }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Close mobile nav when clicking outside or on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const navItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard"
    },
    { 
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Mensagens",
      href: "/mensagens"
    },
    { 
      icon: <Bell className="h-5 w-5" />,
      label: "Notificações",
      href: "/notificacoes"
    },
    { 
      icon: <User className="h-5 w-5" />,
      label: "Meu Perfil",
      href: "/perfil"
    },
    { 
      icon: <Settings className="h-5 w-5" />,
      label: "Configurações",
      href: "/configuracoes"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <nav className="fixed top-16 left-0 w-3/4 max-w-xs h-full bg-white overflow-y-auto pb-10 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Menu</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center py-3 px-3 rounded-md group transition-colors",
                currentPath === item.href 
                  ? "bg-eregulariza-primary/10 text-eregulariza-primary" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={onClose}
            >
              <div className="mr-3 flex-shrink-0">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Separador */}
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* Link para voltar ao site */}
          <a
            href="https://e-regulariza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center py-3 px-3 rounded-md group transition-colors text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <div className="mr-3 flex-shrink-0">
              <ExternalLink className="h-5 w-5" />
            </div>
            <span className="font-medium flex-1">Voltar ao site e-regulariza</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>
      </nav>
    </div>
  );
}
