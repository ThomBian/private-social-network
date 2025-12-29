import { useLocalSearchParams } from "expo-router";
import { Alert, SectionList, StyleSheet, View } from "react-native";
import { BentoRowRenderer } from "../src/components/profile/BentoRowRenderer";
import { groupPostsByMonth } from "../src/utils/bentoEngine";
import { gql, useQuery } from "urql";
import { useMemo } from "react";
import { Post } from "@social/types";
import { Text } from "../src/components/design-kit/Text";
import { Screen } from "../src/components/design-kit/Screen";
import { Button } from "../src/components/design-kit/Button";
import { theme } from "../src/theme/theme";
import { useAuth } from "../src/context/AuthContext";

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
  const { signOut, user } = useAuth();

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
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
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

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">{username}</Text>

        {username === user?.username && (
          <Button
            icon="log-out-outline"
            onPress={handleLogout}
            variant="ghost"
          />
        )}
      </View>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.m,
    gap: theme.spacing.s,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionHeader: {
    paddingVertical: theme.spacing.s,
  },
});
