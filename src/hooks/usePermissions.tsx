
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
      role: null,
    };
  }

  const role = profile.role;
  const isSuperAdmin = role === 'admin_master';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isEditor = role === 'admin_editor' || isAdmin || isSuperAdmin;
  const isViewer = role === 'admin_viewer' || isEditor;

  return {
    canView: true,
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
    role,
  };
}
