// import { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Text } from "../src/components/design-kit/Text";
import { Button } from "../src/components/design-kit/Button";
import { Screen } from "../src/components/design-kit/Screen";
import { theme } from "../src/theme/theme";
import { gql, useMutation } from "urql";
import { useAuth } from "../src/context/AuthContext";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 4;
const IMAGE_SIZE = width / COLUMN_COUNT;

const POST_CREATE_MUTATION = gql`
  mutation (
    $img: String!
    $caption: String!
    $size: String!
    $type: String!
    $authorId: String!
  ) {
    createPost(
      img: $img
      caption: $caption
      size: $size
      type: $type
      authorId: $authorId
    ) {
      id
      caption
      img
      size
      type
      author {
        id
        username
      }
    }
  }
`;

export default function CreatePostScreen() {
  const [permissionResponse, requestPerimission] =
    MediaLibrary.usePermissions();

  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<"rectangle" | "square">(
    "rectangle"
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [resCreation, postCreation] = useMutation(POST_CREATE_MUTATION);
  const { user } = useAuth();

  useEffect(() => {
    async function init() {
      if (permissionResponse?.status !== "granted") {
        const { status } = await requestPerimission();
        if (status !== "granted") {
          return;
        }
      }

      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: ["photo"],
        sortBy: ["creationTime"],
      });

      setPhotos(assets.assets);
      if (assets.assets.length > 0) {
        setSelectedImage(assets.assets[0].uri);
      }
    }

    init();
  }, [permissionResponse, requestPerimission]);

  if (!permissionResponse) {
    return <View />;
  }

  const handlePost = async () => {
    console.log({ user, selectedImage });
    if (!user || !selectedImage) {
      return;
    }

    try {
      const mockURL = `https://picsum.photos/800/800?random=${Date.now()}`;
      const response = await postCreation({
        img: mockURL,
        size: selectedSize,
        authorId: user.id,
        caption: "New drop created from mobile app",
        type: "image",
      });
      if (!response.error) {
        router.back();
      } else {
        alert("Error creating post: " + response.error.message);
      }
    } catch (error) {
      alert("Error creating post: " + error);
    }
  };

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Button onPress={() => router.back()} label="Cancel" variant="ghost" />
        <Text variant="h3">New Drop</Text>
        <Button
          onPress={handlePost}
          label="Next"
          variant="ghost"
          loading={resCreation.fetching}
          disabled={!selectedImage}
        />
      </View>

      <View style={{ flex: 1, gap: theme.spacing.m }}>
        {/* PREVIEW CONTAINER */}
        <View style={{ gap: theme.spacing.m }}>
          <View
            style={{
              height: selectedSize === "rectangle" ? width / 2 : width,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadii.m,
            }}
          >
            {selectedImage ? (
              <Image
                source={selectedImage}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadii.s,
                  height: "100%",
                  width: "100%",
                }}
                contentFit="cover"
              />
            ) : (
              <Text>Select an image below</Text>
            )}
          </View>

          {/* SIZE SELECTOR */}
          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.m,
            }}
          >
            {["rectangle", "square"].map((size) => (
              <Button
                key={size}
                onPress={() => setSelectedSize(size as "rectangle" | "square")}
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
              onPress={() => setSelectedImage(item.uri)}
              activeOpacity={0.8}
            >
              <Image
                source={item.uri}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  opacity: selectedImage === item.uri ? 0.5 : 1,
                  borderColor:
                    selectedImage === item.uri
                      ? theme.colors.primary
                      : "transparent",
                }}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </Screen>
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
  selectedImage: {
    borderRadius: 8,
  },
});
