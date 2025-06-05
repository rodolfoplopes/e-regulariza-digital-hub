
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

export default function AdminUserManagementPage() {
  return (
    <ProtectedAdminRoute requiredRole="admin_master">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <AdminUserManagement />
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
