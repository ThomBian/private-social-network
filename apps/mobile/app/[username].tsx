import { Stack, useLocalSearchParams } from "expo-router";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { BentoRowRenderer } from "../src/components/profile/BentoRowRenderer";
import { RAW_POSTS } from "../src/data/mockPost";
import { groupPostsByMonth } from "../src/utils/bentoEngine";

export const PAGE_PADDING = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: PAGE_PADDING,
  },
  sectionHeader: {
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default function Profile() {
  const { username } = useLocalSearchParams();
  const sections = groupPostsByMonth(RAW_POSTS);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `@${username}` }} />

      <SectionList
        sections={sections}
        renderItem={({ item }) => <BentoRowRenderer row={item} />}
        keyExtractor={(item) => item.id}
        stickyHeaderHiddenOnScroll
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
}
