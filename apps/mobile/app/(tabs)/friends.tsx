import { Screen } from "../../src/components/design-kit/Screen";
import { FlatList, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { theme } from "../../src/theme/theme";
import { useRef, useState } from "react";
import { gql, useMutation, useQuery } from "urql";
import { Text } from "../../src/components/design-kit/Text";
import ConnectionRequest from "../../src/components/friends/ConnectionRequest";
import SearchResult from "../../src/components/friends/SearchResult";
import GroupSelectionBottomSheet from "../../src/components/friends/GroupSelectionBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";

const SEARCH_USERS_QUERY = gql`
  query ($query: String!) {
    searchUsers(query: $query) {
      id
      username
      profile {
        avatar
        fullName
      }
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

const ACCEPT_FOLLOW_MUTATION = gql`
  mutation ($followerId: String!, $group: String!) {
    approveFollow(followerId: $followerId, group: $group) {
      id
      status
      group
    }
  }
`;

interface SearchUserResult {
  username: string;
  id: string;
  profile: {
    fullName?: string;
  };
}

export default function SearchUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [, acceptFollow] = useMutation(ACCEPT_FOLLOW_MUTATION);

  const handleApprove = async (followerId: string, group: string) => {
    const result = await acceptFollow({ followerId, group });
    if (result.error) {
      return alert(
        `Failed to approve connection request. Please try again. ${result.error.message}`
      );
    }
  };

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
          <SearchResult
            key={user.id}
            username={user.username}
            fullName={user.profile.fullName}
          />
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
              <ConnectionRequest
                viewer={item.viewer}
                id={item.id}
                onAcceptConnection={(id) => {
                  setSelectedUser(id);
                  bottomSheetRef.current?.expand();
                }}
              />
            )}
          />
        </View>
      )}

      <GroupSelectionBottomSheet
        onConfirm={function (group: string): void {
          console.log("Selected group:", group);
          console.log("For user:", selectedUser);
          if (selectedUser) {
            handleApprove(selectedUser, group);
          }
          bottomSheetRef.current?.close();
        }}
        bottomSheetRef={bottomSheetRef}
      />
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
