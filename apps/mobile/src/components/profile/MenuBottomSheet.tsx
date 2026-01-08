import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { MenuActions } from "../../types/menuAction";
import { StyleSheet } from "react-native";
import { Text } from "../design-kit/Text";
import IonIcons from "@expo/vector-icons/Ionicons";
import { theme } from "../../theme/theme";
import { RefObject } from "react";

interface MenuBottomSheetProps {
  menuActions: MenuActions[];
  bottomSheetRef: RefObject<BottomSheet | null>;
}

export default function MenuBottomSheet({
  menuActions,
  bottomSheetRef,
}: MenuBottomSheetProps) {
  const handleMenuAction = (action: MenuActions) => {
    if (!bottomSheetRef || !bottomSheetRef.current) return;

    action.onPress();
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.5} />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backgroundStyle={styles.bottomSheetBackground}
      snapPoints={[1]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.menuActionsContainer}>
        {menuActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuActionButton}
            onPress={() => {
              handleMenuAction(action);
            }}
          >
            <IonIcons
              name={action.icon}
              size={24}
              color={
                action.isDestructive ? theme.colors.error : theme.colors.text
              }
            />
            <Text
              style={{ marginLeft: theme.spacing.m }}
              color={
                action.isDestructive ? theme.colors.error : theme.colors.text
              }
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  menuActionsContainer: {
    padding: 36,
    alignItems: "center",
  },
  menuActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
  },
  handleIndicator: {
    backgroundColor: theme.colors.border,
    width: 40,
    height: 4,
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.background,
  },
});
