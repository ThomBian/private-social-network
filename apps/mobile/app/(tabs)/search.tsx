import { Screen } from "../../src/components/design-kit/Screen";
import { StatusBar, StyleSheet, TextInput } from "react-native";
import { theme } from "../../src/theme/theme";
import { useState } from "react";
import { gql, useQuery } from "urql";
import { Text } from "../../src/components/design-kit/Text";
import SearchResult from "../../src/components/search-user/SearchResult";

const SEARCH_USERS_QUERY = gql`
  query ($query: String!) {
    searchUsers(query: $query) {
      id
      username
    }
  }
`;

interface SearchUserResult {
  username: string;
  id: string;
}

export default function SearchUser() {
  const [searchQuery, setSearchQuery] = useState("");

  const [{ data, fetching }] = useQuery({
    query: SEARCH_USERS_QUERY,
    variables: { query: searchQuery },
    pause: searchQuery.length <= 3,
  });

  const matchingUsers: SearchUserResult[] = data ? data.searchUsers : [];

  return (
    <Screen>
      <StatusBar barStyle="dark-content" />

      <TextInput
        style={styles.searchInput}
        placeholder="Search for a user..."
        placeholderTextColor={theme.colors.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
        multiline
        maxLength={500}
      />

      {fetching ? (
        <Text>Searching...</Text>
      ) : (
        matchingUsers.map((user) => (
          <SearchResult key={user.id} username={user.username} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 52,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m,
    padding: theme.spacing.m,
    color: theme.colors.text,
  },
});
