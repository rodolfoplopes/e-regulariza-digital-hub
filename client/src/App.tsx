import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SupabaseAuthProvider } from "@/hooks/useSupabaseAuth";
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
import AboutPage from "./pages/AboutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <SupabaseAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/servicos" element={<ServicesPage />} />
              <Route path="/processo/:processId" element={<ProcessDetail />} />
              <Route path="/processo/:processId/editar" element={<EditProcess />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUserManagementPage />} />
              <Route path="/novo-processo" element={<ProcessCreate />} />
              <Route path="/configuracoes" element={<UserSettings />} />
              <Route path="/configuracoes/logo" element={<LogoManagementPage />} />
              <Route path="/politica-de-privacidade" element={<PolicyPage />} />
              <Route path="/termos-de-uso" element={<PolicyPage />} />
              <Route path="/politica-de-cookies" element={<PolicyPage />} />
              <Route path="/notificacoes" element={<Notifications />} />
              <Route path="/mensagens" element={<Messages />} />
              <Route path="/perfil" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SupabaseAuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
