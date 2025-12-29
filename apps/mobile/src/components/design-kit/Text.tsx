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
}

export const Text = ({
  variant = "body",
  color = theme.colors.text,
  center,
  style,
  ...props
}: Props) => {
  const textStyle: TextStyle = {
    ...theme.typography[variant],
    color,
    textAlign: center ? "center" : "auto",
  };

  return <RNText style={[textStyle, style]} {...props} />;
};
