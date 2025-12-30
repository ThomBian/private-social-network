import { View, StyleSheet } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Text } from "../src/components/design-kit/Text";
import { Button } from "../src/components/design-kit/Button";
import { Screen } from "../src/components/design-kit/Screen";
import { theme } from "../src/theme/theme";
import { gql, useMutation } from "urql";
import { useAuth } from "../src/context/AuthContext";
import ImageSelectionStep from "../src/components/create/step/ImageSelection";
import { MetadataStep } from "../src/components/create/step/Metadata";

type CreatePostStep = "image-selection" | "metadata";

export interface PostFormData {
  selectedImage: string | null;
  selectedSize: "rectangle" | "square";
  caption: string;
}

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
  const [currentStep, setCurrentStep] =
    useState<CreatePostStep>("image-selection");
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [formData, setFormData] = useState<PostFormData>({
    selectedImage: null,
    selectedSize: "rectangle",
    caption: "",
  });
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
        setFormData((prev) => ({
          ...prev,
          selectedImage: assets.assets[0].uri,
        }));
      }
    }

    init();
  }, [permissionResponse, requestPerimission]);

  if (!permissionResponse) {
    return <View />;
  }

  const handleNext = () => {
    if (currentStep === "image-selection") {
      setCurrentStep("metadata");
    }
  };

  const handleBack = () => {
    if (currentStep === "metadata") {
      setCurrentStep("image-selection");
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.selectedImage) {
      return;
    }

    try {
      const mockURL = `https://picsum.photos/800/800?random=${Date.now()}`;
      const response = await postCreation({
        img: mockURL,
        size: formData.selectedSize,
        authorId: user.id,
        caption: formData.caption || "New drop created from mobile app",
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

  const isNextDisabled = () => {
    if (currentStep === "image-selection") {
      return !formData.selectedImage;
    }
    return false;
  };

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Button onPress={handleBack} label="Back" variant="ghost" />
        <Text variant="h3">{getHeaderTitle()}</Text>
        <Button
          onPress={
            currentStep === "image-selection" ? handleNext : handleSubmit
          }
          label={currentStep === "image-selection" ? "Next" : "Create"}
          variant="ghost"
          loading={resCreation.fetching}
          disabled={isNextDisabled()}
        />
      </View>

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.m }}>
        {currentStep === "image-selection" && (
          <ImageSelectionStep
            selectedImage={formData.selectedImage}
            selectedSize={formData.selectedSize}
            photos={photos}
            onImageSelect={(uri) =>
              setFormData((prev) => ({ ...prev, selectedImage: uri }))
            }
            onSizeSelect={(size) =>
              setFormData((prev) => ({ ...prev, selectedSize: size }))
            }
            onNext={handleNext}
          />
        )}

        {currentStep === "metadata" && (
          <MetadataStep
            selectedImage={formData.selectedImage}
            selectedSize={formData.selectedSize}
            caption={formData.caption}
            onCaptionChange={(caption) =>
              setFormData((prev) => ({ ...prev, caption }))
            }
            onSubmit={handleSubmit}
            isLoading={resCreation.fetching}
          />
        )}
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
});
