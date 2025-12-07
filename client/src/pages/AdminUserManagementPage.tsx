
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

export default function AdminUserManagementPage() {
  return (
    <ProtectedAdminRoute requiredRole="admin_master">
      <AdminUserManagement />
    </ProtectedAdminRoute>
  );
}
