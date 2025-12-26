import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ddd",
  },
  fakeImg: {
    marginTop: 10,
    width: "100%",
    height: 300,
    backgroundColor: "#eee",
  },
});

export default function Post({
  username,
  text,
}: {
  username: string;
  text: string;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push(`/${username}`)}
      >
        <View style={styles.avatar} />
        <Text>{username}</Text>
      </TouchableOpacity>

      <View style={styles.fakeImg} />

      <View>
        <Text>
          <Text style={{ fontWeight: "bold" }}>{username}</Text>
          {"  "}
          {text}
        </Text>
      </View>
    </View>
  );
}
