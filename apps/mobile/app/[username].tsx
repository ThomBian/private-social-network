import { Stack, useLocalSearchParams } from "expo-router";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { BentoRowRenderer } from "../src/components/profile/BentoRowRenderer";
import { groupPostsByMonth } from "../src/utils/bentoEngine";
import { gql, useQuery } from "urql";
import { useMemo } from "react";
import { Post } from "@social/types";

export const PAGE_PADDING = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: PAGE_PADDING,
  },
  sectionHeader: {
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

const PROFILE_QUERY = gql`
  query ($username: String!) {
    profilePosts(username: $username) {
      id
      post_date
      img
      caption
      size
      type
    }
  }
`;

export default function Profile() {
  const { username } = useLocalSearchParams();

  const [{ data, fetching, error }] = useQuery({
    query: PROFILE_QUERY,
    variables: { username },
  });

  const sections = useMemo(() => {
    if (fetching || error || !data) {
      return [];
    }
    return groupPostsByMonth(data.profilePosts as Post[]);
  }, [data, fetching, error]);

  if (fetching) {
    return (
      <View
        style={
          (styles.container,
          { height: "100%", alignItems: "center", justifyContent: "center" })
        }
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={
          (styles.container,
          { height: "100%", alignItems: "center", justifyContent: "center" })
        }
      >
        <Text>Error loading profile posts.</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `@${username}`, headerShown: true }} />

      <SectionList
        sections={sections}
        renderItem={({ item }) => <BentoRowRenderer row={item} />}
        keyExtractor={(item) => item.id}
        stickyHeaderHiddenOnScroll
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
      />
    </View>
  );
}
