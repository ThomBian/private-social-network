import { useLocalSearchParams } from "expo-router";
import { groupPostsByMonth } from "../src/utils/bentoEngine";
import { gql, useQuery } from "urql";
import { useMemo } from "react";
import { Post } from "@social/types";
import { Text } from "../src/components/design-kit/Text";
import { Screen } from "../src/components/design-kit/Screen";
import ConnectionButton from "../src/components/profile/ConnectionButton";
import { useProfileConnection } from "../src/hooks/useProfileConnection";
import ProfileHeader from "../src/components/profile/ProfileHeader";
import ProfileInfo from "../src/components/profile/ProfileInfo";
import PostsList from "../src/components/profile/PostsList";

const PROFILE_INFO_QUERY = gql`
  query ($username: String!) {
    userByUsername(username: $username) {
      id
      username
      profile {
        bio
        avatar
        fullName
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
    <Screen styleContent={{ paddingHorizontal: 0 }} safe={false}>
      <PostsList
        sections={sections}
        isFecthing={isFetchingPosts}
        error={error}
        header={
          <>
            <ProfileHeader avatar={profile.avatar} />

            <ProfileInfo
              username={username as string}
              fullName={profile.fullName}
              bio={profile.bio}
              actionButton={
                <ConnectionButton
                  isLoading={isLoading}
                  connection={connectionToMe}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              }
            />
          </>
        }
      />
    </Screen>
  );
}
