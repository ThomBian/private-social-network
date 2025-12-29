import { FlatList, StatusBar } from "react-native";
import Header from "../src/components/feed/Header";
import Post from "../src/components/feed/Post";
import { useQuery } from "urql";
import { useMemo } from "react";
import { Post as PostType } from "@social/types";
import { EmptyState } from "../src/components/feed/EmptyState";
import { Text } from "../src/components/design-kit/Text";
import { Screen } from "../src/components/design-kit/Screen";

const feedQuery = `
  query {
    feed {
      id
      caption
      img
      size
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
        <Text>Error while loading feed.</Text>
        <Text>{error.message}</Text>
      </>
    );
  } else {
    content = (
      <FlatList
        data={posts}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <Post
            username={item.author.username}
            caption={item.caption}
            img={item.img}
            size={item.size}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Header}
        ListEmptyComponent={EmptyState}
      />
    );
  }

  return (
    <Screen>
      <StatusBar barStyle="dark-content" />

      {content}
    </Screen>
  );
}
