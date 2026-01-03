// app/_layout.js
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Client, Provider } from "urql";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useEffect, useState } from "react";
import createUrqlClient from "../src/utils/urql-client";

function RootLayoutNav() {
  const { user, isLoading, token } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Initialize urql client with auth token
  useEffect(() => {
    const initClient = async () => {
      const urqlClient = await createUrqlClient(token);
      setClient(urqlClient);
      setClientLoading(false);
    };
    initClient();
  }, [token]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isOnAuthPage = segments[0] === "login";

    if (!user && !isOnAuthPage) {
      router.replace("/login");
    } else if (user && isOnAuthPage) {
      router.replace("/");
    }
  }, [user, isLoading, segments, router]);

  if (isLoading || clientLoading || !client) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider value={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ animation: "fade" }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="[username]" />
        <Stack.Screen name="create" options={{ title: "Nouveau postr" }} />
      </Stack>
    </Provider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
