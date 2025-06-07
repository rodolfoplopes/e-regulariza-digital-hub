
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/supabaseService';

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

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial session and profile
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const userProfile = await profileService.getCurrentProfile();
          if (userProfile) {
            setProfile({
              ...userProfile,
              role: userProfile.role as Profile['role']
            });
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await profileService.getCurrentProfile();
          if (userProfile) {
            console.log('User profile loaded:', userProfile);
            setProfile({
              ...userProfile,
              role: userProfile.role as Profile['role']
            });
          }
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      // Clear any cached data
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('loginCooldown');
    } catch (error) {
      console.error('Error during logout:', error);
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
