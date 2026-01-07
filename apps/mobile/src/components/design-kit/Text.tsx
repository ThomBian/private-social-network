import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { theme } from "../../theme/theme";

interface Props extends RNTextProps {
  variant?: keyof typeof theme.typography;
  color?: string;
  center?: boolean;
  fontWeight?: "default" | "bold" | "fat";
}

const fontWeightMap = {
  default: "500",
  bold: "600",
  fat: "800",
};

export const Text = ({
  variant = "body",
  color = theme.colors.text,
  center,
  style,
  fontWeight = "default",
  ...props
}: Props) => {
  const textStyle: TextStyle = {
    ...theme.typography[variant],
    color,
    textAlign: center ? "center" : "auto",
    fontWeight: fontWeightMap[fontWeight] as TextStyle["fontWeight"],
  };

  return <RNText style={[textStyle, style]} {...props} />;
};
