import { View } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Screen } from "../src/components/design-kit/Screen";
import ImageSelectionStep from "../src/components/create/step/ImageSelection";
import { MetadataStep } from "../src/components/create/step/Metadata";
import { useCreatePost } from "../src/hooks/useCreatePost";
import { useMediaLibrary } from "../src/hooks/useMediaLibrary";
import Header from "../src/components/create/Header";

type CreatePostStep = "image-selection" | "metadata";

export interface PostFormData {
  selectedImage: string | null;
  selectedSize: "rectangle" | "square";
  caption: string;
}

export default function CreatePostScreen() {
  const router = useRouter();
  const { asyncCreatePost, isLoading: isCreatingPost } = useCreatePost();
  const { photos } = useMediaLibrary();

  const [currentStep, setCurrentStep] =
    useState<CreatePostStep>("image-selection");
  const [formData, setFormData] = useState<PostFormData>({
    selectedImage: photos.length > 0 ? photos[0].uri : null,
    selectedSize: "rectangle",
    caption: "",
  });

  useEffect(() => {
    if (photos.length > 0 && !formData.selectedImage) {
      setFormData((prev) => ({ ...prev, selectedImage: photos[0].uri }));
    }
  }, [formData.selectedImage, photos]);

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
    const success = await asyncCreatePost({
      img: formData.selectedImage!,
      caption: formData.caption,
      size: formData.selectedSize,
    });
    if (success) {
      router.back();
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
      <Header
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isNextDisabled={isNextDisabled()}
        isLoading={isCreatingPost}
      />

      <View style={{ flex: 1 }}>
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
            isLoading={isCreatingPost}
          />
        )}
      </View>
    </Screen>
  );
}
