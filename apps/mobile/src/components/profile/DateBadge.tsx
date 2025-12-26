import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const DateBadge = ({ dateString }: { dateString?: string }) => {
  if (!dateString) return null;
  const day = new Date(dateString).getDate();

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "white", fontSize: 12, fontWeight: "bold" },
});
