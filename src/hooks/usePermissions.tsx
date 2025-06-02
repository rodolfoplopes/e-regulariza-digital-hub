
import { useAuth } from "@/App";

export interface PermissionConfig {
  canEditAllUsers: boolean;
  canViewAdmin: boolean;
  canEditProcesses: boolean;
  canViewReports: boolean;
  canEditPolicies: boolean;
  canManageSystem: boolean;
  canEditOwnProfile: boolean;
  canViewOwnProcesses: boolean;
}

export const usePermissions = (): PermissionConfig => {
  const { user, role } = useAuth();

  if (role === "admin") {
    return {
      canEditAllUsers: true,
      canViewAdmin: true,
      canEditProcesses: true,
      canViewReports: true,
      canEditPolicies: true,
      canManageSystem: true,
      canEditOwnProfile: true,
      canViewOwnProcesses: true,
    };
  }

  // Cliente permissions
  return {
    canEditAllUsers: false,
    canViewAdmin: false,
    canEditProcesses: false,
    canViewReports: false,
    canEditPolicies: false,
    canManageSystem: false,
    canEditOwnProfile: true,
    canViewOwnProcesses: true,
  };
};

export const useCanAccess = (requiredPermission: keyof PermissionConfig): boolean => {
  const permissions = usePermissions();
  return permissions[requiredPermission];
};
