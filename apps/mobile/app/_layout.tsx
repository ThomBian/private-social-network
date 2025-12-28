// app/_layout.js
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useEffect } from "react";

const API_URL = Platform.select({
  ios: "http://192.168.1.164:3000/graphql",
  android: "http://10.0.2.2:3000/graphql",
  default: "http://localhost:3000/graphql",
});

console.log("📱 Connecting to Backend at:", API_URL);

const client = new Client({
  url: API_URL!,
  exchanges: [cacheExchange, fetchExchange],
});

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: "fade" }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="[username]" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <Provider value={client}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </Provider>
  );
}
