import { User } from "@social/types";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import { useRouter } from "expo-router";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = await SecureStorage.getItemAsync("user_session");
        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const signIn = async (newUser: User) => {
    setUser(newUser);
    await SecureStorage.setItemAsync("user_session", JSON.stringify(newUser));
    router.replace("/");
  };

  const signOut = async () => {
    setUser(null);
    await SecureStorage.deleteItemAsync("user_session");
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn: signIn, signOut: signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
