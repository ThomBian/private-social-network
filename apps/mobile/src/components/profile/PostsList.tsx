import { SectionList, StyleSheet, View } from "react-native";
import { Text } from "../design-kit/Text";
import { BentoRowRenderer } from "./BentoRowRenderer";
import { theme } from "../../theme/theme";
import { ReactElement } from "react";

interface PostsListProps {
  sections: any[];
  isFecthing: boolean;
  error?: Error;
  header: ReactElement;
}

export default function PostsList({
  sections,
  isFecthing,
  error,
  header,
}: PostsListProps) {
  if (isFecthing) {
    return <Text>Loading posts...</Text>;
  }

  if (error) {
    return <Text>Error loading posts: {error.message}</Text>;
  }

  return (
    <SectionList
      sections={sections}
      renderItem={({ item }) => <BentoRowRenderer row={item} />}
      keyExtractor={(item) => item.id}
      stickyHeaderHiddenOnScroll
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.postsSectionHeader}>
          <Text variant="h1">{title}</Text>
        </View>
      )}
      contentContainerStyle={{
        // paddingHorizontal: theme.spacing.s,
        paddingBottom: 200,
      }}
      ListHeaderComponent={header}
    />
  );
}

const styles = StyleSheet.create({
  postsSectionHeader: {
    padding: theme.spacing.s,
  },
});
