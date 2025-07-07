
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bell, 
  Settings,
  User,
  ExternalLink
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isExternal?: boolean;
}

const SidebarItem = ({ icon, label, href, isActive, isExternal }: SidebarItemProps) => {
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center py-2 px-3 rounded-md group transition-colors",
          "text-eregulariza-darkgray hover:bg-gray-100"
        )}
      >
        <div className="mr-3">{icon}</div>
        <span className="flex-1">{label}</span>
        <ExternalLink className="h-4 w-4 ml-2" />
      </a>
    );
  }

  return (
      <Link
        to={href}
        className={cn(
          "flex items-center py-2 px-3 rounded-md group transition-colors",
          isActive 
            ? "nav-item-active" 
            : "text-eregulariza-darkgray hover:bg-gray-100"
        )}
      >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

export default function DashboardSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarItems = [
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

  return (
    <aside className="w-64 border-r bg-white h-full hidden md:block">
      <div className="p-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath === item.href}
            />
          ))}
          
          {/* Separador */}
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* Link para voltar ao site */}
          <SidebarItem
            icon={<ExternalLink className="h-5 w-5" />}
            label="Acessar site institucional"
            href="https://e-regulariza.com"
            isActive={false}
            isExternal={true}
          />
        </nav>
      </div>
    </aside>
  );
}
