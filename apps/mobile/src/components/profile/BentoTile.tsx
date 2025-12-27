import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BentoItem } from "../../types/bento";
import { Post } from "@social/types";
import { DateBadge } from "./DateBadge";

interface Props {
  item: BentoItem;
  width: number;
  height: number;
}

const FILLER_EMOJIS = ["📸", "🌴", "✨", "💭", "🎨", "👀"];

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
  if (item.type === "filler") {
    const emojiIndex = item.id.length % FILLER_EMOJIS.length;
    const emoji = FILLER_EMOJIS[emojiIndex];
    return (
      <View style={[styles.filler, { width, height }]}>
        <Text>{emoji}</Text>
      </View>
    );
  }

  const post = item as Post;
  return (
    <TouchableOpacity onPress={() => alert(`view post ${post.id}`)}>
      <View style={[styles.post, { width, height }]} />
      <DateBadge dateString={post.post_date} />
    </TouchableOpacity>
  );
}
