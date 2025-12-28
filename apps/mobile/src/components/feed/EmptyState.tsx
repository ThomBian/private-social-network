import { View, Text } from "react-native";
import IonIcons from "@expo/vector-icons/Ionicons";

export function EmptyState() {
  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <IonIcons name="sunny-outline" size={64} color="#ccc" />
      <Text style={{ fontSize: 18, color: "#666", marginTop: 16 }}>
        Nothing to display here.
      </Text>
    </View>
  );
}
