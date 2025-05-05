import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
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
  cpf?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    // Small delay to simulate API check
    setTimeout(checkUser, 500);
  }, []);

  // Mock login function - would be replaced with actual auth in a real app
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation logic (in a real app, this would be a proper API call)
    if (email && password) {
      // Check if admin credentials
      if (email.includes('admin')) {
        const adminUser: User = {
          id: "1",
          name: "Admin E-regulariza",
          email: email,
          role: "admin",
          cpf: "123.456.789-00"
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setIsLoading(false);
        return true;
      } else {
        // Regular user
        const regularUser: User = {
          id: "2",
          name: "Cliente E-regulariza",
          email: email,
          role: "cliente",
          cpf: "987.654.321-00"
        };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const authContextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    role: user?.role || null,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Secure Route component for admin only access
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated, role } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading indicator
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eregulariza-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (role !== "admin") {
    // Redirect to unauthorized page if not admin
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

// Secure Route component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    // Show loading indicator
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eregulariza-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
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
      className="px-4 py-2 bg-eregulariza-primary text-white rounded hover:bg-opacity-90 transition-colors"
    >
      Voltar
    </button>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AuthProvider>
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
          </AuthProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
