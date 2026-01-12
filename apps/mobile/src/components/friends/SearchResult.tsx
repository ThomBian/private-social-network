import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../design-kit/Text";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";

interface SearchResultProps {
  username: string;
  fullName?: string;
  avatar?: string;
}

export default function SearchResult({
  username,
  fullName,
  avatar,
}: SearchResultProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isCurrentUser = user?.username === username;
  const url = isCurrentUser ? "/profile" : (`/${username}` as const);

  return (
    <TouchableOpacity onPress={() => router.push(url)} style={styles.container}>
      <Text fontWeight="bold">{fullName}</Text>
      <Text variant="caption">{username}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.s,
    gap: theme.spacing.xs,
  },
});
