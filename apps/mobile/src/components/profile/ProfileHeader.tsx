import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "../design-kit/Button";
import { theme } from "../../theme/theme";
import { MenuActions } from "../../types/menuAction";

export const PICTURE_HEIGHT = 400;

interface ProfileHeaderProps {
  avatar: string;
  menuActions?: MenuActions[];
  onMenuPress?: () => void;
}

export default function ProfileHeader({
  avatar,
  menuActions,
  onMenuPress,
}: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <>
      {avatar && <Image source={avatar} style={styles.avatar} />}

      <View style={styles.headerContainer}>
        <Button
          icon="arrow-back"
          onPress={() => router.back()}
          iconSize={28}
          variant="ghost"
        />

        {menuActions && menuActions.length > 0 && onMenuPress && (
          <Button
            icon="ellipsis-vertical"
            onPress={onMenuPress}
            variant="ghost"
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: PICTURE_HEIGHT,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },

  headerContainer: {
    paddingVertical: theme.spacing.m,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.l,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
});
