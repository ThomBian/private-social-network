import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { theme } from "../../theme/theme";
import { Text } from "../design-kit/Text";
import { Button } from "../design-kit/Button";
import { router } from "expo-router";

interface ConnectionRequestProps {
  id: string;
  viewer: {
    id: string;
    username: string;
    profile: {
      avatar: string;
      fullName: string;
    };
  };
  onAcceptConnection: (viewerId: string) => void;
}

const AVATAR_SIZE = 40;

export default function ConnectionRequest({
  viewer,
  onAcceptConnection,
}: ConnectionRequestProps) {
  const { profile } = viewer;
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => router.push(`/${viewer.username}`)}
    >
      {profile.avatar ? (
        <Image
          source={profile.avatar}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: theme.borderRadii.full,
          }}
        />
      ) : (
        <View
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: theme.borderRadii.full,
            backgroundColor: theme.colors.gray300,
          }}
        />
      )}

      <View
        style={{
          flex: 1,
          padding: theme.spacing.s,
        }}
      >
        <Text fontWeight="fat">{profile.fullName}</Text>
        <Text variant="caption">{`@${viewer.username}`}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.s,
          alignItems: "center",
        }}
      >
        <Button
          iconSize={12}
          icon="person-add"
          variant="primary"
          onPress={() => onAcceptConnection(viewer.id)}
          style={{
            height: 44,
            width: 44,
          }}
        />
        <Button
          iconSize={20}
          icon="close"
          variant="ghost"
          onPress={() => {
            alert("Decline request");
          }}
          style={{
            height: 32,
            width: 32,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
