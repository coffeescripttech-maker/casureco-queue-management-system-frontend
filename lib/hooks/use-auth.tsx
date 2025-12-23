'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, login as loginService, logout as logoutService, getCurrentUser } from '@/lib/services/auth-service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  login: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token) {
      // Fetch current user
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
          setProfile(userData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          localStorage.removeItem('auth_token');
          setLoading(false);
        });
    } else {
      // Use setTimeout to avoid direct setState in effect
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  async function handleLogin(email: string, password: string) {
    try {
      const { user: userData } = await loginService(email, password);
      setUser(userData);
      setProfile(userData);
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.role === 'supervisor') {
        router.push('/admin'); // Supervisors also go to admin
      } else {
        router.push('/staff'); // Staff goes to staff dashboard
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function handleSignOut() {
    await logoutService();
    setUser(null);
    setProfile(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login: handleLogin,
        signOut: handleSignOut,
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