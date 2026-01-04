import { Screen } from "../../src/components/design-kit/Screen";
import { Alert, StatusBar, View, StyleSheet, SectionList } from "react-native";
import { Text } from "../../src/components/design-kit/Text";
import { useAuth } from "../../src/context/AuthContext";
import { gql, useQuery } from "urql";
import { useMemo } from "react";
import { groupPostsByMonth } from "../../src/utils/bentoEngine";
import { Post } from "@social/types";
import { Button } from "../../src/components/design-kit/Button";
import { theme } from "../../src/theme/theme";
import { BentoRowRenderer } from "../../src/components/profile/BentoRowRenderer";

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

export default function MyProfile() {
  const { signOut, user } = useAuth();

  const [
    { data: userProfileInfo, fetching: profileLoading, error: profileError },
  ] = useQuery({
    query: PROFILE_INFO_QUERY,
    variables: { username: user?.username },
  });

  const [{ data, fetching: isFetchingPosts, error }] = useQuery({
    query: POSTS_QUERY,
    variables: { username: user?.username },
    pause: profileLoading || !!profileError,
  });

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

  const handleLogout = () => {
    Alert.alert(`Confirm logout`, "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => signOut(),
        style: "destructive",
      },
    ]);
  };

  const { profile } = userProfileInfo?.userByUsername ?? {};

  return (
    <Screen>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text variant="h1">{user?.username}</Text>

          <Button
            icon="log-out-outline"
            onPress={handleLogout}
            variant="ghost"
          />
        </View>

        <View>
          <Text>{profile?.bio}</Text>
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
