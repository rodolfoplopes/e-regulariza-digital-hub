
import { Badge } from "@/components/ui/badge";

interface UserRoleIndicatorProps {
  role: string;
  className?: string;
}

export default function UserRoleIndicator({ role, className }: UserRoleIndicatorProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin_master':
        return {
          label: 'Super Admin',
          variant: 'destructive' as const,
          className: 'bg-admin-master text-white border-admin-master'
        };
      case 'admin':
        return {
          label: 'Admin',
          variant: 'default' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'admin_editor':
        return {
          label: 'Editor',
          variant: 'secondary' as const,
          className: 'bg-admin-editor text-white border-admin-editor'
        };
      case 'admin_viewer':
        return {
          label: 'Viewer',
          variant: 'outline' as const,
          className: 'bg-admin-viewer text-white border-admin-viewer'
        };
      case 'cliente':
        return {
          label: 'Cliente',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          label: 'Usuário',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
}
