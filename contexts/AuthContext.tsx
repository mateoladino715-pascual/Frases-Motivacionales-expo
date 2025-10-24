import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forceLogout: () => Promise<void>;
  simpleLogout: () => Promise<void>;
  debugAuthState: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          console.log('🚪 No session, clearing user state');
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        // Si no existe el perfil, crearlo
        await createUserProfile(authUser);
        return;
      }

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (authUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
        });

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Register error:', error);
        return false;
      }

      // En Supabase, después del registro puede que necesites confirmar el email
      // Si el usuario ya está confirmado, cargar su perfil inmediatamente
      if (data.user && data.session) {
        await loadUserProfile(data.user);
        return true;
      }

      // Si no hay sesión inmediata, significa que necesita confirmar email
      return !!data.user;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      if (!user) return false;

      // Actualizar perfil en Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, email })
        .eq('id', user.id);

      if (profileError) {
        console.error('Update profile error:', profileError);
        return false;
      }

      // Actualizar email en auth si es diferente
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email,
        });

        if (authError) {
          console.error('Update auth email error:', authError);
          return false;
        }
      }

      // Actualizar estado local
      setUser(prev => prev ? { ...prev, name, email } : null);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

      const logout = async () => {
        try {
          console.log('🚪 Starting logout process...');
          
          // Limpiar el estado local inmediatamente
          setUser(null);
          setIsLoading(false);
          console.log('✅ Local state cleared');
          
          // Intentar cerrar sesión en Supabase
          try {
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.log('⚠️ Supabase logout error:', error.message);
            } else {
              console.log('✅ Supabase logout successful');
            }
          } catch (supabaseError) {
            console.log('⚠️ Supabase logout failed:', supabaseError);
          }
          
          console.log('✅ Logout process completed');
          
        } catch (error) {
          console.error('❌ Logout error:', error);
          // En caso de error, asegurar que el estado local esté limpio
          setUser(null);
          setIsLoading(false);
        }
      };

  // Método para debuggear el estado de autenticación
  const debugAuthState = async () => {
    try {
      console.log('🔍 === DEBUG AUTH STATE ===');
      console.log('🔍 Local user state:', user);
      console.log('🔍 Local isAuthenticated:', !!user);
      console.log('🔍 Local isLoading:', isLoading);
      
      // Solo mostrar estado local, sin depender de Supabase
      console.log('🔍 === LOCAL STATE ONLY ===');
      console.log('🔍 User ID:', user?.id || 'No user');
      console.log('🔍 User Email:', user?.email || 'No email');
      console.log('🔍 User Name:', user?.name || 'No name');
      console.log('🔍 === END DEBUG ===');
      
    } catch (error) {
      console.error('❌ Debug auth state error:', error);
    }
  };

  // Método de logout simple que solo limpia el estado local
  const simpleLogout = async () => {
    try {
      console.log('🚪 Simple logout initiated...');
      
      // Solo limpiar el estado local
      setUser(null);
      setIsLoading(false);
      
      console.log('✅ Simple logout completed - local state cleared');
      
    } catch (error) {
      console.error('❌ Simple logout error:', error);
      // Limpiar estado de todas formas
      setUser(null);
      setIsLoading(false);
    }
  };

  // Método para forzar limpieza completa (en caso de problemas)
  const forceLogout = async () => {
    try {
      console.log('🔄 Force logout initiated...');
      
      // Limpiar estado local inmediatamente
      setUser(null);
      setIsLoading(false);
      console.log('✅ Local state cleared');
      
      // Intentar cerrar sesión en Supabase (sin importar errores)
      try {
        await supabase.auth.signOut();
        console.log('✅ Supabase signOut completed');
      } catch (e) {
        console.log('⚠️ Supabase signOut failed (ignoring):', e);
      }
      
      try {
        await supabase.auth.signOut({ scope: 'local' });
        console.log('✅ Supabase local signOut completed');
      } catch (e) {
        console.log('⚠️ Supabase local signOut failed (ignoring):', e);
      }
      
      // Forzar limpieza del estado una vez más
      setUser(null);
      setIsLoading(false);
      
      console.log('✅ Force logout completed');
      
    } catch (error) {
      console.error('❌ Force logout error:', error);
      // Limpiar estado de todas formas
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        forceLogout,
        simpleLogout,
        debugAuthState,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}