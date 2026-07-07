import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to initialize authentication:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    return await signUp(userData);
  };

  const login = async (credentials) => {
    return await signIn(credentials);
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear local application state
      localStorage.removeItem("activeWorkspace");

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
