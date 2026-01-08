import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { theme } from "../../theme/theme";
import { Text } from "../design-kit/Text";
import { ReactNode } from "react";
import { PICTURE_HEIGHT } from "./ProfileHeader";

interface ProfileInfoProps {
  username: string;
  fullName: string;
  bio?: string;
  actionButton?: ReactNode;
}

export default function ProfileInfo({
  username,
  fullName,
  bio,
  actionButton,
}: ProfileInfoProps) {
  return (
    <LinearGradient
      colors={["transparent", "white", "white"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.textContainer}>
        <View style={styles.identityContainer}>
          <Text variant="h1" fontWeight="fat">
            {fullName}
          </Text>
          <Text variant="body" color={theme.colors.textDim}>
            @{username}
          </Text>
        </View>
        {bio && (
          <Text variant="body" style={styles.bio}>
            {bio}
          </Text>
        )}

        {actionButton}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: PICTURE_HEIGHT,
    justifyContent: "flex-end",
  },
  textContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
  identityContainer: { gap: theme.spacing.xs, marginBottom: theme.spacing.s },
  bio: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
});
