
import { useSupabaseAuth } from './useSupabaseAuth';

export interface PermissionConfig {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canEditAllUsers: boolean;
  canCreateUsers: boolean;
  canManagePermissions: boolean;
  canViewAllProcesses: boolean;
  canEditAllProcesses: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  isActive: boolean;
  role: string | null;
}

export function usePermissions(): PermissionConfig {
  const { profile, isAuthenticated } = useSupabaseAuth();

  if (!isAuthenticated || !profile) {
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      canEditAllUsers: false,
      canCreateUsers: false,
      canManagePermissions: false,
      canViewAllProcesses: false,
      canEditAllProcesses: false,
      isAdmin: false,
      isSuperAdmin: false,
      isEditor: false,
      isViewer: false,
      isActive: false,
      role: null,
    };
  }

  const role = profile.role;
  const isActive = role !== 'inactive';
  const isSuperAdmin = role === 'admin_master' && isActive;
  const isAdmin = (role === 'admin' || isSuperAdmin) && isActive;
  const isEditor = (role === 'admin_editor' || isAdmin || isSuperAdmin) && isActive;
  const isViewer = (role === 'admin_viewer' || isEditor) && isActive;

  return {
    canView: isActive,
    canEdit: isEditor,
    canDelete: isAdmin,
    canManageUsers: isAdmin,
    canEditAllUsers: isAdmin,
    canCreateUsers: isSuperAdmin,
    canManagePermissions: isSuperAdmin,
    canViewAllProcesses: isViewer,
    canEditAllProcesses: isEditor,
    isAdmin,
    isSuperAdmin,
    isEditor,
    isViewer,
    isActive,
    role,
  };
}
