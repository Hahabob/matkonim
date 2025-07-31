import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "../lib/axios";
import { success } from "zod";
interface User {
  name?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      console.log("AuthContext: fetching user data...");
      const { data } = await api.get("/auth/me", {
        withCredentials: true,
      });
      setUser(data.data);
      console.log("AuthContext: user data fetched:", data.data);
    } catch (err) {
      console.error("AuthContext: error fetching user:", err);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext: login attempt for:", email);
      await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(success);
      await fetchUser();
      console.log("AuthContext: login successful");
      return true;
    } catch (err) {
      console.error("AuthContext: login error:", err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log("AuthContext: registering user:", email);
      await api.post(
        "/auth/register",
        { name, email, password },
        { withCredentials: true }
      );
      console.log("AuthContext: registration successful");
      return true;
    } catch (err: any) {
      console.error("AuthContext: registration error:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Register failed"
      );
    }
  };

  const logout = async () => {
    try {
      console.log("AuthContext: logging out user");
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch {
      throw new Error("Error logging Out");
    } finally {
      setUser(null);
      console.log("AuthContext: user logged out, state cleared");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = { user, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth, not set properly");
  }
  return context;
};
