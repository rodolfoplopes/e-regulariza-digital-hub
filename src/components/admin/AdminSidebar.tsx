
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  Shield,
  Activity,
  Database,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed?: boolean;
}

const SidebarItem = ({ icon, label, href, isActive, isCollapsed }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center py-3 px-3 rounded-md group transition-colors relative",
      isActive 
        ? "bg-eregulariza-primary text-white" 
        : "text-gray-700 hover:bg-gray-100"
    )}
  >
    <div className="mr-3 flex-shrink-0">{icon}</div>
    {!isCollapsed && <span className="truncate">{label}</span>}
    {isActive && (
      <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
    )}
  </Link>
);

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

const SidebarSection = ({ title, children, isCollapsed }: SidebarSectionProps) => (
  <div className="space-y-2">
    {!isCollapsed && (
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const permissions = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const dashboardItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard Principal",
      href: "/admin"
    },
    { 
      icon: <Activity className="h-5 w-5" />,
      label: "Métricas",
      href: "/admin/metrics"
    }
  ];

  const clientItems = [
    { 
      icon: <Users className="h-5 w-5" />,
      label: "Clientes",
      href: "/admin/clients"
    },
    { 
      icon: <FileText className="h-5 w-5" />,
      label: "Processos",
      href: "/admin/processes"
    }
  ];

  const teamItems = [
    { 
      icon: <Shield className="h-5 w-5" />,
      label: "Administradores",
      href: "/admin/users"
    }
  ];

  const systemItems = [
    { 
      icon: <Settings className="h-5 w-5" />,
      label: "Configurações",
      href: "/admin/settings"
    },
    { 
      icon: <Database className="h-5 w-5" />,
      label: "Integrações",
      href: "/admin/integrations"
    }
  ];

  const superAdminItems = permissions.isSuperAdmin ? [
    { 
      icon: <Activity className="h-5 w-5" />,
      label: "Logs de Auditoria",
      href: "/admin/audit"
    },
    { 
      icon: <Shield className="h-5 w-5" />,
      label: "Permissões",
      href: "/admin/permissions"
    }
  ] : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">
              Admin Panel
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <SidebarSection title="Dashboard" isCollapsed={isCollapsed}>
          {dashboardItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Clientes" isCollapsed={isCollapsed}>
          {clientItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Equipe" isCollapsed={isCollapsed}>
          {teamItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Sistema" isCollapsed={isCollapsed}>
          {systemItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </SidebarSection>

        {permissions.isSuperAdmin && (
          <SidebarSection title="Super Admin" isCollapsed={isCollapsed}>
            {superAdminItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarSection>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Admin Panel
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <SidebarSection title="Dashboard">
            {dashboardItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href}
                isCollapsed={false}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Clientes">
            {clientItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href}
                isCollapsed={false}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Equipe">
            {teamItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href}
                isCollapsed={false}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Sistema">
            {systemItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={currentPath === item.href}
                isCollapsed={false}
              />
            ))}
          </SidebarSection>

          {permissions.isSuperAdmin && (
            <SidebarSection title="Super Admin">
              {superAdminItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={currentPath === item.href}
                  isCollapsed={false}
                />
              ))}
            </SidebarSection>
          )}
        </nav>
      </aside>
    </>
  );
}
