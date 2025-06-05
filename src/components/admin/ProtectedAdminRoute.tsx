
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'admin_master' | 'admin_editor' | 'admin_viewer';
}

export default function ProtectedAdminRoute({ 
  children, 
  requiredRole = 'admin_viewer' 
}: ProtectedAdminRouteProps) {
  const { profile, isLoading } = useSupabaseAuth();
  const permissions = usePermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-eregulariza-primary"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = () => {
    switch (requiredRole) {
      case 'admin_master':
        return permissions.isSuperAdmin;
      case 'admin_editor':
        return permissions.isEditor;
      case 'admin_viewer':
        return permissions.isViewer;
      case 'admin':
        return permissions.isAdmin;
      default:
        return false;
    }
  };

  if (!hasRequiredRole()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
