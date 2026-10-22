"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextProps {
  isAuthenticated: boolean;
  authChecked: boolean;
  userEmail: string | null;
  username: string | null; // added username to context
  login: (email: string, password: string, username?: string) => void;
  logout: () => void;
  register: (email: string, password: string, username?: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Load auth flag & user email from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth");
      const storedEmail = localStorage.getItem("userEmail");
      if (storedAuth === "true" && storedEmail) {
        setIsAuthenticated(true);
        setUserEmail(storedEmail);
      }
      setAuthChecked(true);
    }
  }, []);

  const getUsers = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, string>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const register = (email: string, password: string, username?: string) => {
    const users = getUsers();
    if (users[email]) {
      toast.error("User already exists. Please log in.");
      router.push("/login");
      return;
    }
    users[email] = password; // NOTE: In production, hash passwords!
    saveUsers(users);
    // Store optional username for later use
    if (username) {
      localStorage.setItem("userName", username);
    }
    toast.success("Registration successful! You are now logged in.");
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem("auth", "true");
    localStorage.setItem("userEmail", email);
    // Redirect to stored URL (e.g. /checkout) or default to /shop
    const redirect = localStorage.getItem("redirectAfterLogin");
    localStorage.removeItem("redirectAfterLogin");
    router.push(redirect || "/shop");
  };

  const login = (email: string, password: string, username?: string) => {
    const users = getUsers();
    if (users[email] && users[email] === password) {
      setIsAuthenticated(true);
      setUserEmail(email);
      // Store username if provided, otherwise keep previous value
      if (username) setUsername(username);
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", "true");
        localStorage.setItem("userEmail", email);
        // Use username if available, otherwise fallback to email prefix
        const displayName = username ? username : email.split("@")[0];
        toast.success(`Welcome back ${displayName}!`);
      }
      // Redirect to stored URL (e.g. /checkout) or default to /shop
      const redirect = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirect || "/shop");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
      localStorage.removeItem("userEmail");
      toast.success(`Logged out successfully!`);
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authChecked, userEmail, username, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
