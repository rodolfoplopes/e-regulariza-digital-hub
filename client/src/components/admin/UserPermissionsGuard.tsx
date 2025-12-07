
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldX } from "lucide-react";

interface UserPermissionsGuardProps {
  children: React.ReactNode;
  requiredPermission: 'canEdit' | 'canDelete' | 'canManageUsers' | 'canCreateUsers' | 'canManagePermissions';
  fallbackMessage?: string;
}

export default function UserPermissionsGuard({ 
  children, 
  requiredPermission, 
  fallbackMessage = "Você não tem permissão para acessar esta funcionalidade." 
}: UserPermissionsGuardProps) {
  const permissions = usePermissions();

  if (!permissions[requiredPermission]) {
    return (
      <Alert variant="destructive" className="my-4">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          {fallbackMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
