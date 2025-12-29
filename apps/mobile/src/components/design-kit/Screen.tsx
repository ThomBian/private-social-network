import React from "react";
import { ViewStyle, View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../theme/theme";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  safe?: boolean;
  styleContent?: ViewStyle;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.s,
    display: "flex",
  },
});

export const Screen = ({
  children,
  style,
  styleContent,
  safe = true,
}: Props) => {
  const Container = safe ? SafeAreaView : View;

  return (
    <Container style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.content, styleContent]}>{children}</View>
    </Container>
  );
};
