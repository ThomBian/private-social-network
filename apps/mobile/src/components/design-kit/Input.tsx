import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { theme } from "../../theme/theme";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  helperText?: string;
}

export const TextInput = ({
  label,
  error,
  containerStyle,
  helperText,
  placeholderTextColor,
  ...props
}: TextInputProps) => {
  const styles = StyleSheet.create({
    // Styles for the TextInput component would go here
    container: { marginBottom: theme.spacing.m, gap: theme.spacing.s },
    input: {
      fontSize: 16,
      color: theme.colors.text,
      borderColor: error ? theme.colors.error : theme.colors.border,
      backgroundColor: theme.colors.gray100,
      borderRadius: theme.borderRadii.full,
      borderWidth: 1,
      padding: theme.spacing.m,
      fontWeight: "500",
    },
  });

  return (
    // Placeholder implementation
    <View style={[styles.container, containerStyle]}>
      {label && <Text fontWeight="bold">{label}</Text>}
      <RNTextInput
        style={[styles.input]}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
      {error && (
        <Text color={theme.colors.error} variant="caption">
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text color={theme.colors.textDim} variant="caption">
          {helperText}
        </Text>
      )}
    </View>
  );
};
