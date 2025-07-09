import { Badge } from "@/components/ui/badge";
import { User, FileText, Users, Settings, ArrowRight } from "lucide-react";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  target_name?: string;
  details?: any;
  created_at: string;
  admin_name?: string;
}

export const getTargetIcon = (targetType: string) => {
  switch (targetType) {
    case 'user':
      return <User className="h-4 w-4" />;
    case 'process':
      return <FileText className="h-4 w-4" />;
    case 'client':
      return <Users className="h-4 w-4" />;
    case 'system':
      return <Settings className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const getTargetTypeBadge = (targetType: string) => {
  const config = {
    user: { label: 'Usuário', variant: 'default' as const },
    process: { label: 'Processo', variant: 'secondary' as const },
    client: { label: 'Cliente', variant: 'outline' as const },
    system: { label: 'Sistema', variant: 'destructive' as const },
  };

  const typeConfig = config[targetType as keyof typeof config] || config.system;

  return (
    <Badge variant={typeConfig.variant} className="flex items-center gap-1">
      {getTargetIcon(targetType)}
      {typeConfig.label}
    </Badge>
  );
};

export const getRoleChangeDisplay = (log: AuditLog) => {
  if (log.details && log.details.old_role && log.details.new_role) {
    const getRoleLabel = (role: string) => {
      switch (role) {
        case 'admin_master': return 'Super Admin';
        case 'admin': return 'Admin';
        case 'admin_editor': return 'Editor';
        case 'admin_viewer': return 'Viewer';
        default: return role;
      }
    };

    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
          {getRoleLabel(log.details.old_role)}
        </span>
        <ArrowRight className="h-3 w-3 text-gray-400" />
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
          {getRoleLabel(log.details.new_role)}
        </span>
      </div>
    );
  }
  return null;
};

export const getActionTooltip = (log: AuditLog) => {
  let description = `Ação realizada por ${log.admin_name}`;
  
  if (log.details) {
    if (log.details.old_role && log.details.new_role) {
      description += ` - Alterou permissão de ${log.details.old_role} para ${log.details.new_role}`;
    }
    if (log.details.user_email) {
      description += ` - Email: ${log.details.user_email}`;
    }
  }
  
  return description;
};