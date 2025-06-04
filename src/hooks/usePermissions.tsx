
import { useSupabaseAuth } from './useSupabaseAuth';

export interface PermissionConfig {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  isAdmin: boolean;
}

export function usePermissions(): PermissionConfig {
  const { profile, isAuthenticated } = useSupabaseAuth();

  if (!isAuthenticated || !profile) {
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      isAdmin: false,
    };
  }

  const isAdmin = profile.role === 'admin';

  return {
    canView: true,
    canEdit: isAdmin,
    canDelete: isAdmin,
    canManageUsers: isAdmin,
    isAdmin,
  };
}
