import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "../design-kit/Text";
import { theme } from "../../theme/theme";
import { Button } from "../design-kit/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
    paddingHorizontal: theme.spacing.s,
    paddingRight: 0,
  },
  iconButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="h2" accessibilityLabel="Papaya">
        Papaya 🥭
      </Text>

      <Button
        icon="add"
        variant="ghost"
        onPress={() => router.push("/create")}
      />
    </View>
  );
}
