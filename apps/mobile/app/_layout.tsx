// app/_layout.js
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

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

export default function Layout() {
  return (
    <Provider value={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[username]" />
      </Stack>
    </Provider>
  );
}
