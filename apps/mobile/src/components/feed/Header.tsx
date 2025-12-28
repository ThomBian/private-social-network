import IonIcons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function Header() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => alert("Open new Pub")}
      >
        <IonIcons name="add" color="#000" size={28} />
      </TouchableOpacity>

      <Text style={styles.title}>Nom du reseau</Text>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => alert("See Likes!")}
      >
        <IonIcons name="heart-outline" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}
