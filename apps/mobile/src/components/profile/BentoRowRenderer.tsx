import { Dimensions, StyleSheet, View } from "react-native";
import { BentoRow } from "../../types/bento";
import BentoTile from "./BentoTile";

const SCREEN_WIDTH = Dimensions.get("window").width - 16;
const GAP = 2;

const styles = StyleSheet.create({
  row: {
    marginBottom: GAP,
    flexDirection: "row",
  },
  gap: {
    width: GAP,
  },
});

export const BentoRowRenderer = ({ row }: { row: BentoRow }) => {
  if (row.type === "row_square") {
    return (
      <View style={styles.row}>
        <BentoTile
          item={row.items[0]}
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH}
        />
      </View>
    );
  } else if (row.type === "row_rectangle") {
    const height = SCREEN_WIDTH / 2;
    return (
      <View style={styles.row}>
        <BentoTile item={row.items[0]} width={SCREEN_WIDTH} height={height} />
      </View>
    );
  } else {
    // row_of_tinies
    const tileWidth = SCREEN_WIDTH / 2;
    const tileHeight = tileWidth;
    const [left, right] = row.items;
    return (
      <View style={styles.row}>
        <BentoTile item={left} width={tileWidth} height={tileHeight} />
        <View style={styles.gap} />
        <BentoTile item={right} width={tileWidth} height={tileHeight} />
      </View>
    );
  }
};
