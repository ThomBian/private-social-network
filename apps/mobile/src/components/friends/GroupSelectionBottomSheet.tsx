import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Text } from "../design-kit/Text";
import { StyleSheet } from "react-native";
import { Button } from "../design-kit/Button";
import { useState } from "react";
import { theme } from "../../theme/theme";

interface GroupSelectionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onConfirm: (group: string) => void;
}

const groups = ["FRIENDS", "FAMILY", "OTHERS"];

const GROUP_LABELS: { [key: string]: string } = {
  FRIENDS: "Friends",
  FAMILY: "Family",
  OTHERS: "Others",
};

export default function GroupSelectionBottomSheet({
  bottomSheetRef,
  onConfirm,
}: GroupSelectionBottomSheetProps) {
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.5} />
  );

  const [selectedGroup, setSelectedGroup] = useState<string>(groups[2]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backgroundStyle={styles.bottomSheetBackground}
      snapPoints={[1]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.container}>
        <Text variant="h3">Pick a group:</Text>

        {groups.map((group) => (
          <Button
            key={group}
            variant="outline"
            label={GROUP_LABELS[group]}
            onPress={() => setSelectedGroup(group)}
            style={group === selectedGroup ? styles.selectedGroupButton : {}}
          />
        ))}

        <Button
          label="Accept connection"
          variant="primary"
          onPress={() => onConfirm(selectedGroup)}
        />

        <Button
          label="Cancel"
          variant="ghost"
          onPress={() => bottomSheetRef.current?.close()}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    gap: theme.spacing.s,
    padding: theme.spacing.m,
  },
  groupButton: {
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  groupButtonText: {
    fontSize: 16,
  },
  selectedGroupButton: {
    backgroundColor: "#eee",
    borderColor: theme.colors.primary,
  },
});
