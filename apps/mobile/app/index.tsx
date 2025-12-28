import { Text, FlatList, StatusBar, StyleSheet } from "react-native";

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../src/components/feed/Header";
import Post from "../src/components/feed/Post";
import { useQuery } from "urql";
import { useMemo } from "react";
import { Post as PostType } from "@social/types";
import { EmptyState } from "../src/components/feed/EmptyState";

const feedQuery = `
  query {
    feed {
      id
      caption
      author {
        username
      }
    }
  }
`;

export default function Feed() {
  const [{ data, fetching, error }] = useQuery({ query: feedQuery });

  const posts = useMemo(() => {
    if (fetching || error || !data) {
      return [];
    }
    return data.feed as PostType[];
  }, [data, fetching, error]);

  let content;

  if (fetching) {
    content = <Text>Loading...</Text>;
  } else if (error) {
    content = (
      <>
        <Text>Error loading feed.</Text>
        <Text>{error.message}</Text>
      </>
    );
  } else {
    content = (
      <FlatList
        data={posts}
        style={{ width: "100%", padding: 16 }}
        renderItem={({ item }) => (
          <Post username={item.author.username} text={item.caption} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Header}
        ListEmptyComponent={EmptyState}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Stack.Screen options={{ headerShown: false }} />

      {content}
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
