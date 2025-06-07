
import EnhancedProcessCreate from "@/components/process/EnhancedProcessCreate";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

export default function ProcessCreate() {
  return (
    <ProtectedAdminRoute requiredRole="admin">
      <div className="min-h-screen bg-white">
        <EnhancedProcessCreate />
      </div>
    </ProtectedAdminRoute>
  );
}
