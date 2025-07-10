
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ContactPage from "./pages/ContactPage";
import ProcessDetail from "./pages/ProcessDetail";
import EditProcess from "./pages/EditProcess";
import AdminDashboard from "./pages/AdminDashboard";
import ProcessCreate from "./pages/ProcessCreate";
import UserSettings from "./pages/UserSettings";
import PolicyPage from "./pages/PolicyPage";
import Notifications from "./pages/Notifications";
import LogoManagementPage from "./pages/LogoManagementPage";
import AdminUserManagementPage from "./pages/AdminUserManagement";
import Messages from "./pages/Messages";
import UserProfile from "./pages/UserProfile";
import ServicesPage from "./pages/ServicesPage";
import GTMManager from '@/components/tracking/GTMManager';
import { analytics } from '@/services/analyticsService';
import { SupabaseAuthProvider, useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const queryClient = new QueryClient();

// Route protection components
const ProtectedRoute = ({ 
  requiredRole = "any" 
}: { 
  requiredRole?: "admin" | "cliente" | "any" 
}) => {
  const { isLoading, isAuthenticated, checkPermission } = useSupabaseAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eregulariza-primary mx-auto"></div>
          <p className="mt-4 text-eregulariza-description">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!checkPermission(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

// Public routes - accessible to all users
const PublicRoute = () => {
  const { isAuthenticated, role, isLoading } = useSupabaseAuth();
  const location = useLocation();

  // Don't redirect while loading
  if (isLoading) {
    return <Outlet />;
  }

  if (isAuthenticated && ['/login', '/register'].includes(location.pathname)) {
    // Improved redirection logic based on role
    if (role === 'admin_master' || role === 'admin' || role === 'admin_editor' || role === 'admin_viewer') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'cliente') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

// Unauthorized page component
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="text-center max-w-md">
      <h1 className="text-3xl font-bold text-eregulariza-gray mb-4">Acesso Negado</h1>
      <p className="text-eregulariza-description mb-6">
        Você não tem permissão para acessar esta página. Entre em contato com o administrador se precisar de acesso.
      </p>
      <div className="space-y-3">
        <button 
          onClick={() => window.history.back()} 
          className="block w-full px-4 py-2 bg-eregulariza-primary text-white rounded hover:bg-opacity-90 transition-colors"
        >
          Voltar
        </button>
        <a 
          href="/dashboard" 
          className="block w-full px-4 py-2 border border-eregulariza-primary text-eregulariza-primary rounded hover:bg-eregulariza-primary hover:text-white transition-colors"
        >
          Ir para o Dashboard
        </a>
      </div>
    </div>
  </div>
);

const AppContent = () => {
  const { profile } = useSupabaseAuth();
  const gtmId = localStorage.getItem('gtm_id') || '';
  const gtmEnabled = localStorage.getItem('gtm_enabled') === 'true';

  // Initialize analytics on app load
  useEffect(() => {
    if (profile?.id) {
      analytics.setUser(profile.id);
    }
  }, [profile]);

  return (
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Toaster />
            <Sonner />
            {gtmEnabled && gtmId && <GTMManager gtmId={gtmId} />}
            <Routes>
              {/* Public routes (accessible to all) */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/servicos" element={<ServicesPage />} />
                <Route path="/politica-de-privacidade" element={<PolicyPage />} />
                <Route path="/termos-de-uso" element={<PolicyPage />} />
                <Route path="/politica-de-cookies" element={<PolicyPage />} />
                <Route path="/:policyType" element={<PolicyPage />} />
              </Route>

              {/* Protected routes for authenticated users (clients) */}
              <Route element={<ProtectedRoute requiredRole="cliente" />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/configuracoes" element={<UserSettings />} />
                <Route path="/mensagens" element={<Messages />} />
                <Route path="/notificacoes" element={<Notifications />} />
                <Route path="/perfil" element={<UserProfile />} />
                <Route path="/contato" element={<ContactPage />} />
                <Route path="/processo/:processId" element={<ProcessDetail />} />
              </Route>
              
              {/* Admin-only routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/novo-processo" element={<ProcessCreate />} />
                <Route path="/admin/processo/:processId/editar" element={<EditProcess />} />
                <Route path="/admin/logo" element={<LogoManagementPage />} />
                <Route path="/admin/usuarios" element={<AdminUserManagementPage />} />
              </Route>
              
              {/* Other routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <AppContent />
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
