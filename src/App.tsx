import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ContactPage from "./pages/ContactPage";
import ProcessDetail from "./pages/ProcessDetail";
import AdminDashboard from "./pages/AdminDashboard";
import ProcessCreate from "./pages/ProcessCreate";
import UserSettings from "./pages/UserSettings";
import PolicyPage from "./pages/PolicyPage";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

// Types for user authentication
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "cliente";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string | null;
}

// Mock function to get the current user (in a real app, this would check auth)
const getCurrentUser = (): AuthContextType => {
  // For demo purposes, we'll use a mock user
  // In a real app, this would check the auth state
  // from localStorage, cookies, or an auth provider
  const mockUser = {
    id: "1",
    name: "Admin E-regulariza",
    email: "admin@eregulariza.com.br",
    role: "admin" as const,
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
    role: mockUser.role
  };
};

// Secure Route component for admin only access
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated, role } = getCurrentUser();
  
  if (isLoading) {
    // Show loading indicator
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  if (role !== "admin") {
    // Redirect to unauthorized page if not admin
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};

// Secure Route component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = getCurrentUser();
  
  if (isLoading) {
    // Show loading indicator
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Unauthorized page component
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
    <h1 className="text-3xl font-bold">Acesso Negado</h1>
    <p className="text-gray-500 mt-2 mb-6">Você não tem permissão para acessar esta página.</p>
    <button 
      onClick={() => window.history.back()} 
      className="px-4 py-2 bg-primary text-white rounded"
    >
      Voltar
    </button>
  </div>
);

const App = () => {
  const { user, role } = getCurrentUser();
  const [initialRedirect, setInitialRedirect] = useState<boolean>(false);
  
  useEffect(() => {
    // This simulates a redirect after login based on user role
    // In a real app, this would be part of the authentication flow
    if (user && !initialRedirect) {
      setInitialRedirect(true);
    }
  }, [user, initialRedirect]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes for all authenticated users */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
              <Route path="/contato" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
              <Route path="/processo/:processId" element={<ProtectedRoute><ProcessDetail /></ProtectedRoute>} />
              <Route path="/notificacoes" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/novo-processo" element={<AdminRoute><ProcessCreate /></AdminRoute>} />
              
              {/* Public policy pages */}
              <Route path="/politica-de-privacidade" element={<PolicyPage />} />
              <Route path="/termos-de-uso" element={<PolicyPage />} />
              <Route path="/politica-de-cookies" element={<PolicyPage />} />
              
              {/* Legacy route - keep for backwards compatibility */}
              <Route path="/:policyType" element={<PolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
