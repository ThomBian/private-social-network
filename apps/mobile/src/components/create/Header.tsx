import { View, StyleSheet } from "react-native";
import { Button } from "../design-kit/Button";
import { Text } from "../design-kit/Text";
import { theme } from "../../theme/theme";

interface HeaderProps {
  currentStep: "image-selection" | "metadata";
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isNextDisabled: boolean;
  isLoading: boolean;
}

export default function Header({
  currentStep,
  onBack,
  onNext,
  onSubmit,
  isNextDisabled,
  isLoading,
}: HeaderProps) {
  const getHeaderTitle = () => {
    switch (currentStep) {
      case "image-selection":
        return "Select Image";
      case "metadata":
        return "Post Details";
      default:
        return "New Drop";
    }
  };

  const isLastStep = currentStep === "metadata";

  return (
    <View style={styles.header}>
      <Button onPress={onBack} variant="ghost" label="Back" />
      <Text variant="h2">{getHeaderTitle()}</Text>
      <Button
        onPress={isLastStep ? onSubmit : onNext}
        disabled={isNextDisabled || isLoading}
        loading={isLoading}
        label={isLastStep ? "Create" : "Next"}
        variant="ghost"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
});
