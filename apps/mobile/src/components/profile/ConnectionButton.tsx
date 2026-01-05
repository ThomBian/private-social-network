import { View } from "react-native";
import { Button } from "../design-kit/Button";

const STATUS_TO_LABEL: { [key: string]: string } = {
  PENDING: "Cancel Request",
  BLOCKED: "Pending",
  ACCEPTED: "Remove connection",
};

type ConnectionStatusType = "PENDING" | "BLOCKED" | "ACCEPTED" | null;

interface ConnectionButtonProps {
  connection: { status: string } | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

function getLabel(status: string | null) {
  if (!status) {
    return "Connect";
  }
  return STATUS_TO_LABEL[status];
}

export default function ConnectionButton({
  connection,
  onConnect,
  onDisconnect,
  isLoading,
}: ConnectionButtonProps) {
  const status = connection?.status as ConnectionStatusType;
  const label = getLabel(status);
  const isConnected = !!connection;

  const onPress = isConnected ? onDisconnect : onConnect;

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Button
        style={{ flex: 1 }}
        label={label}
        onPress={onPress}
        loading={isLoading}
      />
    </View>
  );
}
