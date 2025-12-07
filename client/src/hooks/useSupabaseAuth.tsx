
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cliente' | 'admin_master' | 'admin_editor' | 'admin_viewer';
  cpf?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  checkPermission: (requiredRole: "admin" | "cliente" | "any") => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Session timeout configuration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiration

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [warningShown, setWarningShown] = useState(false);
  
  const { toast } = useToast();

  // Activity tracking events
  const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

  // Reset activity timer
  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    setWarningShown(false);
  }, []);

  // Setup activity listeners
  useEffect(() => {
    activityEvents.forEach(event => {
      window.addEventListener(event, resetActivityTimer, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetActivityTimer);
      });
    };
  }, [resetActivityTimer]);

  // Session timeout monitoring
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;

      if (inactiveTime >= SESSION_TIMEOUT) {
        // Session expired - force logout
        handleSessionExpired();
      } else if (inactiveTime >= SESSION_TIMEOUT - WARNING_TIME && !warningShown) {
        // Show warning 5 minutes before expiration
        setWarningShown(true);
        toast({
          title: "Sessão prestes a expirar",
          description: "Sua sessão irá expirar em 5 minutos por inatividade. Mova o mouse para continuar.",
          duration: 10000,
        });
      }
    }, 60000); // Check every minute

    setSessionTimeout(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, lastActivity, warningShown, toast]);

  // Handle session expiration
  const handleSessionExpired = useCallback(async () => {
    console.log('Session expired due to inactivity');
    
    // Clear local state
    setUser(null);
    setProfile(null);
    
    // Clear any stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Broadcast logout to other tabs
    broadcastLogout();
    
    // Show expiration message
    toast({
      title: "Sessão expirada",
      description: "Sua sessão expirou por inatividade. Por favor, faça login novamente.",
      duration: 5000,
    });
    
    // Redirect to login
    window.location.href = '/login';
  }, [toast]);

  // Broadcast logout to other tabs
  const broadcastLogout = useCallback(() => {
    try {
      const channel = new BroadcastChannel('auth-channel');
      channel.postMessage({ type: 'LOGOUT' });
      channel.close();
    } catch (error) {
      // Fallback to localStorage event
      localStorage.setItem('logout-event', Date.now().toString());
      localStorage.removeItem('logout-event');
    }
  }, []);

  // Listen for logout events from other tabs
  useEffect(() => {
    let broadcastChannel: BroadcastChannel | null = null;

    try {
      broadcastChannel = new BroadcastChannel('auth-channel');
      broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'LOGOUT') {
          handleLogoutFromOtherTab();
        }
      };
    } catch (error) {
      // Fallback to storage event
      const handleStorageEvent = (e: StorageEvent) => {
        if (e.key === 'logout-event') {
          handleLogoutFromOtherTab();
        }
      };
      window.addEventListener('storage', handleStorageEvent);
      
      return () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  // Handle logout from other tabs
  const handleLogoutFromOtherTab = useCallback(() => {
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  }, []);

  // Validate session on initialization
  const validateSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        throw error;
      }

      if (session?.user) {
        // Check if token is still valid by making an authenticated request
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        setUser(session.user);
        if (profile) {
          setProfile({
            ...profile,
            role: profile.role as Profile['role']
          });
        }
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      // Clear invalid session
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial session and set up auth listener
  useEffect(() => {
    validateSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
          resetActivityTimer();
        }

        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await profileService.getCurrentProfile();
            if (userProfile) {
              console.log('User profile loaded:', userProfile);
              setProfile({
                ...userProfile,
                role: userProfile.role as Profile['role']
              });
            }
          } catch (error) {
            console.error('Error loading profile:', error);
          }
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [validateSession, resetActivityTimer]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful, fetching profile...');
        resetActivityTimer(); // Reset activity timer on successful login
        
        const userProfile = await profileService.getCurrentProfile();
        if (userProfile) {
          console.log('Profile fetched:', userProfile);
          setProfile({
            ...userProfile,
            role: userProfile.role as Profile['role']
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { success: false, error: 'Erro inesperado durante o login' };
    }
  };

  const register = async (email: string, password: string, userData?: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o cadastro' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Starting secure logout process...');
      
      // Clear activity monitoring
      if (sessionTimeout) {
        clearInterval(sessionTimeout);
        setSessionTimeout(null);
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
      }

      // Clear all local state
      setUser(null);
      setProfile(null);
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cookies (if applicable)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });

      // Broadcast logout to other tabs
      broadcastLogout();
      
      // Show success message
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      console.log('Secure logout completed');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setProfile(null);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      const userProfile = await profileService.getCurrentProfile();
      if (userProfile) {
        setProfile({
          ...userProfile,
          role: userProfile.role as Profile['role']
        });
      }
    }
  };

  const checkPermission = (requiredRole: "admin" | "cliente" | "any"): boolean => {
    if (!profile) return false;
    if (requiredRole === "any") return true;
    if (requiredRole === "admin") {
      return profile.role === "admin" || 
             profile.role === "admin_master" || 
             profile.role === "admin_editor" || 
             profile.role === "admin_viewer";
    }
    return true; // For "cliente" role, both admins and clients can access
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: Boolean(user && profile),
    role: profile?.role || null,
    login,
    logout,
    register,
    checkPermission,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
