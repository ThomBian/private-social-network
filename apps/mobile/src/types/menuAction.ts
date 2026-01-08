import IonIcons from "@expo/vector-icons/Ionicons";

export interface MenuActions {
  label: string;
  onPress: () => void;
  icon: React.ComponentProps<typeof IonIcons>["name"];
  isDestructive?: boolean;
}
