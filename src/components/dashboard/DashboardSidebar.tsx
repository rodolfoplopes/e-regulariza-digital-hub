
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

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center py-2 px-3 rounded-md group transition-colors",
      isActive 
        ? "bg-eregulariza-primary/10 text-eregulariza-primary" 
        : "text-gray-700 hover:bg-gray-100"
    )}
  >
    <div className="mr-3">{icon}</div>
    <span>{label}</span>
  </Link>
);

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
        </nav>
      </div>
    </aside>
  );
}
