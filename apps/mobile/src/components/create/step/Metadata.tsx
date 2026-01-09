// Metadata Step Component

import { View, TextInput, Dimensions, StyleSheet } from "react-native";
import { theme } from "../../../theme/theme";
import { Image } from "expo-image";
import { Text } from "../../design-kit/Text";
import { Button } from "../../design-kit/Button";

interface Props {
  onCaptionChange: (caption: string) => void;
  caption: string;
  selectedImage: string | null;
  selectedSize: "rectangle" | "square";
  onAudienceChange: (audience: string) => void;
  selectedAudiences: string[];
}

const { width } = Dimensions.get("window");
const POST_AUDIENCES = ["FAMILY", "FRIENDS", "OTHERS"];
const POST_AUDIENCES_LABELS: Record<string, string> = {
  FAMILY: "Family",
  FRIENDS: "Friends",
  OTHERS: "Others",
};

export function MetadataStep({
  onCaptionChange,
  caption,
  selectedImage,
  selectedSize,
  onAudienceChange,
  selectedAudiences,
}: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.selectedImageContainer,
          {
            height: selectedSize === "rectangle" ? width / 2 : width,
          },
        ]}
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

      <View>
        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption to your post..."
          placeholderTextColor={theme.colors.text}
          value={caption}
          onChangeText={onCaptionChange}
          multiline
          maxLength={500}
        />
      </View>

      <View style={{ gap: theme.spacing.s }}>
        <Text variant="caption">Select who can see:</Text>

        <View style={{ flexDirection: "row", gap: theme.spacing.m }}>
          {POST_AUDIENCES.map((audience) => (
            <Button
              key={audience}
              label={POST_AUDIENCES_LABELS[audience]}
              onPress={() => {
                onAudienceChange(audience);
              }}
              variant="outline"
              style={
                selectedAudiences.includes(audience)
                  ? { ...styles.selectedGroupButton, flex: 1 }
                  : { flex: 1 }
              }
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  selectedImageContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.m,
    overflow: "hidden",
  },
  captionInput: {
    color: theme.colors.text,
    fontSize: 16,
    textAlignVertical: "top",
  },
  selectedGroupButton: {
    backgroundColor: "#eee",
    borderColor: theme.colors.primary,
  },
});
