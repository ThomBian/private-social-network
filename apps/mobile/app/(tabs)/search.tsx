import { Screen } from "../../src/components/design-kit/Screen";
import { StatusBar } from "react-native";
import { Text } from "../../src/components/design-kit/Text";

export default function SearchUser() {
  return (
    <Screen>
      <StatusBar barStyle="dark-content" />
      <Text>Search User Screen</Text>
    </Screen>
  );
}
