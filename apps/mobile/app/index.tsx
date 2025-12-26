import { FlatList, StatusBar, StyleSheet } from "react-native";

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../src/components/feed/Header";
import Post from "../src/components/feed/Post";

const DATA = [
  {
    id: "1",
    username: "Alice",
    text: "Nature walk 🌲",
    img: "https://picsum.photos/600/600",
  },
  {
    id: "2",
    username: "Bob",
    text: "My new keyboard ⌨️",
    img: "https://picsum.photos/600/601",
  },
  {
    id: "3",
    username: "Charlie",
    text: "Coffee time ☕",
    img: "https://picsum.photos/600/602",
  },
  {
    id: "4",
    username: "David",
    text: "Ideas loading... 💡",
    img: "https://picsum.photos/600/603",
  },
  {
    id: "5",
    username: "Eva",
    text: "Blue Sky ☁️",
    img: "https://picsum.photos/600/604",
  },
];

export default function Feed() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={DATA}
        style={{ width: "100%", padding: 16 }}
        renderItem={({ item }) => (
          <Post username={item.username} text={item.text} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Header}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
