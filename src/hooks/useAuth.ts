// InfiniteCraft.store_React/src/hooks/useAuth.ts

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';

// Definición de tipos
interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  region: string;
  comuna: string;
  role: 'ADMIN' | 'SELLER' | 'CLIENT';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para decodificar el token JWT y obtener la información del usuario
const decodeToken = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    
    // Asumiendo que el payload del token contiene la información del usuario
    // y que el backend de Spring Boot lo serializa correctamente.
    return {
      id: payload.id,
      nombre: payload.nombre,
      email: payload.email,
      telefono: payload.telefono,
      region: payload.region,
      comuna: payload.comuna,
      role: payload.role,
    } as User;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (t: string) => {
    try {
      // En un entorno real, se debería usar el endpoint /auth/validate
      // para verificar la validez del token en el servidor.
      
      // const response = await axios.post(ENDPOINTS.VALIDATE_TOKEN, null, {
      //   params: { token: t }
      // });
      
      // if (response.status === 200) {
        const decodedUser = decodeToken(t);
        if (decodedUser) {
          setUser(decodedUser);
          setToken(t);
          localStorage.setItem('authToken', t);
        } else {
          logout();
        }
      // } else {
      //   logout();
      // }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, { email, password });
      
      // Asumiendo que el backend devuelve el token en el cuerpo de la respuesta, 
      // por ejemplo, { token: "..." }
      const newToken = response.data.token; 

      if (newToken) {
        await validateToken(newToken);
      } else {
        throw new Error("Token not received from login endpoint.");
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed. Please check your credentials.");
      }
      throw new Error("An unexpected error occurred during login.");
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
