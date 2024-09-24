import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import AuthPage from '../pages/components/auth';  

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    async function loadUserFromToken() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            if (!userData.onboardingComplete) {
              router.push('/onboarding');
            }
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
      setLoading(false);
    }
    loadUserFromToken();
  }, [router]);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    if (!userData.onboardingComplete) {
      router.push('/onboarding');
    } else {
      router.push('/dating-assistant');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, AuthPage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}