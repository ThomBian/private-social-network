import { useLocalSearchParams } from "expo-router";
import { SectionList, StyleSheet, View } from "react-native";
import { BentoRowRenderer } from "../src/components/profile/BentoRowRenderer";
import { groupPostsByMonth } from "../src/utils/bentoEngine";
import { gql, useQuery } from "urql";
import { useMemo } from "react";
import { Post } from "@social/types";
import { Text } from "../src/components/design-kit/Text";
import { Screen } from "../src/components/design-kit/Screen";
import { theme } from "../src/theme/theme";
import ConnectionButton from "../src/components/profile/ConnectionButton";
import { useProfileConnection } from "../src/hooks/useProfileConnection";

const PROFILE_INFO_QUERY = gql`
  query ($username: String!) {
    userByUsername(username: $username) {
      id
      username
      profile {
        bio
      }
      connectionToMe {
        group
        status
      }
    }
  }
`;

const POSTS_QUERY = gql`
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

  const [
    { data: userProfileInfo, fetching: profileLoading, error: profileError },
    refetchProfileInfo,
  ] = useQuery({
    query: PROFILE_INFO_QUERY,
    variables: { username },
    requestPolicy: "cache-and-network",
  });

  const [{ data, fetching: isFetchingPosts, error }] = useQuery({
    query: POSTS_QUERY,
    variables: { username },
    pause: profileLoading || !!profileError,
  });

  const { isLoading, handleConnect, handleDisconnect } = useProfileConnection(
    username,
    () => {
      console.log("Refetching profile info...");
      refetchProfileInfo();
    }
  );

  const sections = useMemo(() => {
    if (isFetchingPosts || error || !data) {
      return [];
    }
    return groupPostsByMonth(data.profilePosts as Post[]);
  }, [data, isFetchingPosts, error]);

  if (profileLoading) {
    return (
      <Screen>
        <Text>Loading...</Text>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Text>Error loading profile posts.</Text>
        <Text>{error.message}</Text>
      </Screen>
    );
  }

  const { profile, connectionToMe } = userProfileInfo?.userByUsername ?? {};

  return (
    <Screen>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text variant="h1">{username}</Text>
        </View>

        <View>
          <Text>{profile?.bio}</Text>
          <ConnectionButton
            isLoading={isLoading}
            connection={connectionToMe}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </View>
      </View>

      {isFetchingPosts ? (
        <Text>Loading posts...</Text>
      ) : (
        <SectionList
          sections={sections}
          renderItem={({ item }) => <BentoRowRenderer row={item} />}
          keyExtractor={(item) => item.id}
          stickyHeaderHiddenOnScroll
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text variant="h1">{title}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.m,
    gap: theme.spacing.s,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionHeader: {
    paddingVertical: theme.spacing.s,
  },
});
