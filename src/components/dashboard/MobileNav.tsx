
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Bell, 
  Settings,
  User
} from "lucide-react";

export default function MobileNav({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard"
    },
    { 
      icon: <FileText className="h-5 w-5" />,
      label: "Meus Processos",
      href: "/processos"
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
      <div className="fixed inset-0 bg-black/20" />
      <nav className="fixed top-16 left-0 w-3/4 max-w-xs h-full bg-white overflow-y-auto pb-10">
        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md group transition-colors",
                currentPath === item.href 
                  ? "bg-eregulariza-primary/10 text-eregulariza-primary" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="mr-3">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
