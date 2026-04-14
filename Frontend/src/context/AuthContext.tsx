import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    if (token) {
      setIsAuthenticated(true);
      setUserName(savedName);
    }
  }, []);

  // Persist auth state changes to localStorage
  useEffect(() => {
    if (isAuthenticated && userName) {
      localStorage.setItem("token", "fake-token-for-demo");
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    }
  }, [isAuthenticated, userName]);

  const login = (token: string, name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;