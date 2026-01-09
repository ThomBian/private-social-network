import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { theme } from "../../theme/theme";
import { Text } from "./Text";
import IonIcons from "@expo/vector-icons/Ionicons";
import React from "react";

interface Props {
  label?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ComponentProps<typeof IonIcons>["name"];
  iconSize?: number;
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: theme.borderRadii.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.l,
  },
  iconOnly: {
    width: 56,
    height: 56,
    paddingHorizontal: 0,
  },
});

export const Button = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  icon,
  iconSize = 28,
}: Props) => {
  const isIconOnly = icon && !label;

  const getBackgroundColor = () => {
    if (disabled && variant !== "ghost") return theme.colors.surface;
    if (variant === "primary") return theme.colors.primary;
    if (variant === "secondary") return theme.colors.surface;
    return "transparent";
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textDim;
    if (variant === "primary") return "#FFF";
    return theme.colors.primary;
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.textDim;
    if (variant === "primary") return "#FFF";
    return theme.colors.primary;
  };

  const getPaddingHorizontal = () => {
    if (isIconOnly) return 0;
    if (variant === "ghost") return theme.spacing.s;
    return theme.spacing.l;
  };

  const getPaddingVertical = () => {
    if (isIconOnly) return 0;
    if (variant === "ghost") return theme.spacing.s;
    return theme.spacing.m;
  };

  const getBorderStyle = () => {
    if (variant === "outline") {
      return {
        borderWidth: 1,
        borderColor: disabled ? theme.colors.surface : theme.colors.border,
      };
    }
    return {};
  };

  const color = getTextColor();
  const iconColor = getIconColor();
  const backgroundColor = getBackgroundColor();
  const paddingHorizontal = getPaddingHorizontal();
  const paddingVertical = getPaddingVertical();
  const borderStyle = getBorderStyle();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor, paddingHorizontal, paddingVertical, ...borderStyle },
        isIconOnly && styles.iconOnly,
        style,
      ]}
    >
      {icon && <IonIcons name={icon} color={iconColor} size={iconSize} />}
      {!isIconOnly && loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        !isIconOnly && (
          <Text variant="button" color={color} fontWeight="bold">
            {label}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
};
