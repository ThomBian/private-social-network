import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { theme } from "../../../../src/theme/theme";
import { Button } from "../../../../src/components/design-kit/Button";
import { Text } from "../../../../src/components/design-kit/Text";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 4;
const IMAGE_SIZE = (width - theme.spacing.m) / COLUMN_COUNT;

interface Props {
  selectedImage: string | null;
  photos: MediaLibrary.Asset[];
  onImageSelect: (uri: string) => void;
  onSizeSelect: (size: "rectangle" | "square") => void;
  selectedSize: "rectangle" | "square";
  onNext: () => void;
}

// Image Selection Step Component
export default function ImageSelectionStep({
  photos,
  selectedImage,
  onImageSelect,
  selectedSize,
  onSizeSelect,
}: Props) {
  return (
    <View style={{ flex: 1, gap: theme.spacing.m }}>
      {/* PREVIEW CONTAINER */}
      <View style={{ gap: theme.spacing.m }}>
        <View
          style={[
            styles.previewContainer,
            { height: selectedSize === "rectangle" ? width / 2 : width },
          ]}
        >
          {selectedImage ? (
            <Image
              source={selectedImage}
              style={styles.previewImg}
              contentFit="cover"
            />
          ) : (
            <Text>Select an image below</Text>
          )}
        </View>

        {/* SIZE SELECTOR */}
        <View style={styles.sizeSelector}>
          {["rectangle", "square"].map((size) => (
            <Button
              key={size}
              onPress={() => onSizeSelect(size as "rectangle" | "square")}
              label={size.charAt(0).toUpperCase() + size.slice(1)}
              variant={selectedSize === size ? "primary" : "secondary"}
            />
          ))}
        </View>
      </View>

      {/* IMAGES GRID */}
      <FlatList
        data={photos}
        style={{ borderRadius: theme.borderRadii.m }}
        keyExtractor={(item) => item.uri}
        numColumns={COLUMN_COUNT}
        scrollEnabled={true}
        renderItem={({ item }: { item: MediaLibrary.Asset }) => (
          <TouchableOpacity
            onPress={() => onImageSelect(item.uri)}
            activeOpacity={0.8}
          >
            <Image
              source={item.uri}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                opacity: selectedImage === item.uri ? 0.5 : 1,
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.m,
  },
  previewImg: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadii.s,
    height: "100%",
    width: "100%",
  },
  sizeSelector: {
    flexDirection: "row",
    gap: theme.spacing.m,
  },
});
