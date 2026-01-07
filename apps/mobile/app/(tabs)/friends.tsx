import { Screen } from "../../src/components/design-kit/Screen";
import { FlatList, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { theme } from "../../src/theme/theme";
import { useState } from "react";
import { gql, useQuery } from "urql";
import { Text } from "../../src/components/design-kit/Text";
import ConnectionRequest from "../../src/components/friends/ConnectionRequest";
import SearchResult from "../../src/components/friends/SearchResult";

const SEARCH_USERS_QUERY = gql`
  query ($query: String!) {
    searchUsers(query: $query) {
      id
      username
    }
  }
`;

const CONNECTION_REQUESTS_QUERY = gql`
  query {
    connectionRequests {
      id
      status
      viewer {
        id
        username
        profile {
          avatar
          fullName
        }
      }
    }
  }
`;

interface SearchUserResult {
  username: string;
  id: string;
}

export default function SearchUser() {
  const [searchQuery, setSearchQuery] = useState("");

  const [{ data: requestsData, fetching: requestsFetching, error }] = useQuery({
    query: CONNECTION_REQUESTS_QUERY,
  });

  const [{ data, fetching }] = useQuery({
    query: SEARCH_USERS_QUERY,
    variables: { query: searchQuery },
    pause: searchQuery.length <= 3,
  });

  if (requestsFetching) {
    return (
      <Screen>
        <Text>Loading...</Text>
      </Screen>
    );
  }

  if (error) {
    alert(
      "An error occurred while fetching connection requests: " + error.message
    );
  }

  const matchingUsers: SearchUserResult[] = data ? data.searchUsers : [];

  const requests = requestsData
    ? requestsData.connectionRequests.filter(
        (connection: { status: string }) => connection.status === "PENDING"
      )
    : [];

  return (
    <Screen styleContent={{ gap: theme.spacing.m }}>
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

      {searchQuery && fetching && <Text>Searching...</Text>}
      {searchQuery &&
        !fetching &&
        matchingUsers.map((user) => (
          <SearchResult key={user.id} username={user.username} />
        ))}

      {!searchQuery && (
        <View
          style={{
            flex: 1,
            gap: theme.spacing.s,
            paddingHorizontal: theme.spacing.s,
          }}
        >
          <Text
            variant="caption"
            color={theme.colors.gray600}
            fontWeight="fat"
          >{`Pending request (${requests.length})`}</Text>

          <FlatList
            data={requests}
            scrollEnabled
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>{"No requests yet..."}</Text>}
            renderItem={({ item }) => (
              <ConnectionRequest viewer={item.viewer} id={item.id} />
            )}
          />
        </View>
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
