import { useRouter } from "expo-router";
import { Button } from "../../src/components/design-kit/Button";
import { Text } from "../../src/components/design-kit/Text";
import { Screen } from "../../src/components/design-kit/Screen";
import { View, StyleSheet } from "react-native";
import { TextInput } from "../../src/components/design-kit/Input";
import { theme } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { useState } from "react";

import { useUpdateProfile } from "../../src/hooks/useUpdateProfile";

export default function Edit() {
  const router = useRouter();
  const { user } = useAuth();

  const [formState, setFormState] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    // avatar: user?.profile?.avatar || "",
    location: user?.profile?.location || "",
    bio: user?.profile?.bio || "",
  });

  const { asyncUpdateProfile, isLoading } = useUpdateProfile();

  const handleSave = async () => {
    try {
      await asyncUpdateProfile(formState);
      router.back();
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <Screen style={{ paddingHorizontal: theme.spacing.s }}>
      <View style={styles.header}>
        <Button
          onPress={() => {
            router.back();
          }}
          icon="arrow-back"
          variant="ghost"
          iconSize={24}
        />
        <Text variant="h3">My profile</Text>

        <Button
          onPress={handleSave}
          label="Save"
          variant="ghost"
          loading={isLoading}
        />
      </View>

      <View>
        {/* Photo uploader */}
        <TextInput
          label="First name"
          placeholder="Enter your first name"
          value={formState.firstName}
          onChange={(text) =>
            setFormState({ ...formState, firstName: text.nativeEvent.text })
          }
        />
        <TextInput
          label="Last name"
          placeholder="Enter your last name"
          value={formState.lastName}
          onChange={(text) =>
            setFormState({ ...formState, lastName: text.nativeEvent.text })
          }
        />
        <TextInput
          label="Bio"
          placeholder="Enter your bio"
          multiline
          value={formState.bio}
          onChange={(text) =>
            setFormState({ ...formState, bio: text.nativeEvent.text })
          }
        />
        <TextInput
          label="Location"
          placeholder="Enter your location"
          value={formState.location}
          onChange={(text) =>
            setFormState({ ...formState, location: text.nativeEvent.text })
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
