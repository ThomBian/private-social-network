// Metadata Step Component

import { View, TextInput, Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import { Text } from "../../../components/design-kit/Text";
import { Image } from "expo-image";

interface Props {
  onCaptionChange: (caption: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedImage: string | null;
  selectedSize: "rectangle" | "square";
  caption: string;
}

const { width } = Dimensions.get("window");

export function MetadataStep({
  onCaptionChange,
  selectedImage,
  selectedSize,
  caption,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={{ gap: theme.spacing.s }}>
        <View
          style={{
            height: selectedSize === "rectangle" ? width / 2 : width,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadii.m,
            overflow: "hidden",
          }}
        >
          {selectedImage && (
            <Image
              source={selectedImage}
              style={{
                height: "100%",
                width: "100%",
              }}
              contentFit="cover"
            />
          )}
        </View>
      </View>

      <View style={{ gap: theme.spacing.s }}>
        <View style={{ gap: theme.spacing.s }}>
          <TextInput
            style={styles.captionInput}
            placeholder="Add a caption to your post..."
            placeholderTextColor={theme.colors.text}
            value={caption}
            onChangeText={onCaptionChange}
            multiline
            maxLength={500}
          />
          <Text variant="caption" style={{ alignSelf: "flex-end" }}>
            {caption.length}/500
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.m,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.m,
    padding: theme.spacing.m,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
});
