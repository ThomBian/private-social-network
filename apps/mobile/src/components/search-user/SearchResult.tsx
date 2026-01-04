import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../design-kit/Text";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";

export default function SearchResult({ username }: { username: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const isCurrentUser = user?.username === username;
  const url = isCurrentUser ? "/profile" : (`/${username}` as const);

  return (
    <TouchableOpacity onPress={() => router.push(url)} style={styles.container}>
      <Text style={{ fontWeight: 600 }}>{username}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.s,
  },
});
