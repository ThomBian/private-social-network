import { Screen } from "../../src/components/design-kit/Screen";
import { Alert } from "react-native";
import { Text } from "../../src/components/design-kit/Text";
import { useAuth } from "../../src/context/AuthContext";
import { gql, useQuery } from "urql";
import { useMemo, useRef } from "react";
import { groupPostsByMonth } from "../../src/utils/bentoEngine";
import { Post } from "@social/types";
import ProfileHeader from "../../src/components/profile/ProfileHeader";
import ProfileInfo from "../../src/components/profile/ProfileInfo";
import PostsList from "../../src/components/profile/PostsList";
import BottomSheet from "@gorhom/bottom-sheet";
import { MenuActions } from "../../src/types/menuAction";
import MenuBottomSheet from "../../src/components/profile/MenuBottomSheet";

const PROFILE_INFO_QUERY = gql`
  query ($username: String!) {
    userByUsername(username: $username) {
      id
      username
      profile {
        bio
        fullName
        avatar
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
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  if (error || !user) {
    return (
      <Screen>
        <Text>Error loading profile posts.</Text>
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

  const { profile } = userProfileInfo.userByUsername;

  const handleMenuPress = () => {
    if (!bottomSheetRef.current) return;
    bottomSheetRef.current.expand();
  };

  const menuActions: MenuActions[] = [
    {
      label: "Logout",
      icon: "log-out",
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <Screen styleContent={{ paddingHorizontal: 0 }} safe={false}>
      <PostsList
        sections={sections}
        isFecthing={isFetchingPosts}
        error={error}
        header={
          <>
            <ProfileHeader
              avatar={profile.avatar}
              menuActions={menuActions}
              onMenuPress={handleMenuPress}
            />

            <ProfileInfo
              bio={profile.bio}
              username={user.username}
              fullName={profile.fullName}
            />
          </>
        }
      />

      <MenuBottomSheet
        menuActions={menuActions}
        bottomSheetRef={bottomSheetRef}
      />
    </Screen>
  );
}
