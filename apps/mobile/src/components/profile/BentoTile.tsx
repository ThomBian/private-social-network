import { StyleSheet, TouchableOpacity } from "react-native";
import { Post } from "@social/types";
import { DateBadge } from "./DateBadge";
import { Image } from "expo-image";

interface Props {
  item: Post;
  width: number;
  height: number;
}

const styles = StyleSheet.create({
  filler: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  post: {
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
});

export default function BentoTile({ item, width, height }: Props) {
  return (
    <TouchableOpacity onPress={() => alert(`view post ${item.id}`)}>
      <Image source={item.img} style={[styles.post, { width, height }]} />
      <DateBadge dateString={item.post_date} />
    </TouchableOpacity>
  );
}
