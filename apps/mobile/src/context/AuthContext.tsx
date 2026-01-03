import { User } from "@social/types";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import { useRouter } from "expo-router";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AUTH_STORAGE_KEY = "user_session";
export const AUTH_TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      try {
        const storedUser = await SecureStorage.getItemAsync(AUTH_STORAGE_KEY);
        const storedToken = await SecureStorage.getItemAsync(AUTH_TOKEN_KEY);
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser) as User);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const signIn = async (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    await SecureStorage.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    await SecureStorage.setItemAsync(AUTH_TOKEN_KEY, newToken);
    router.replace("/");
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await SecureStorage.deleteItemAsync(AUTH_STORAGE_KEY);
    await SecureStorage.deleteItemAsync(AUTH_TOKEN_KEY);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
