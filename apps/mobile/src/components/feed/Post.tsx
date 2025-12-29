import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { theme } from "../../theme/theme";

interface Props {
  username: string;
  caption: string;
  img: string;
  size: "square" | "rectangle";
}

const { width } = Dimensions.get("window");

export default function Post({ username, caption, img, size }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push(`/${username}`)}
      >
        <View style={styles.avatar} />
        <Text>{username}</Text>
      </TouchableOpacity>

      <View style={{ height: size === "rectangle" ? width / 2 : width }}>
        <Image
          source={img}
          style={[
            {
              height: "100%",
              width: "100%",
            },
            styles.image,
          ]}
        />
      </View>

      <View>
        <Text>
          <Text style={{ fontWeight: "bold" }}>{username}</Text>
          {"  "}
          {caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    gap: theme.spacing.s,
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

  image: {
    borderRadius: theme.borderRadii.m,
  },
});
