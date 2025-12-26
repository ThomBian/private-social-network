import { BentoPost, BentoRow } from "../types/bento";

function getMonthTitle(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
  };
  return date.toLocaleDateString(undefined, options);
}

export function groupPostsByMonth(posts: BentoPost[]) {
  const sorted = posts.sort((a, b) => {
    return new Date(b.post_date).getTime() - new Date(a.post_date).getTime();
  });

  const sectionsMap: { [key: string]: BentoPost[] } = {};

  sorted.forEach((post) => {
    const monthTitle = getMonthTitle(post.post_date);
    if (!sectionsMap[monthTitle]) {
      sectionsMap[monthTitle] = [];
    }
    sectionsMap[monthTitle].push(post);
  });

  const sections = Object.keys(sectionsMap).map((monthTitle) => ({
    title: monthTitle,
    data: organisePostsIntoBento(sectionsMap[monthTitle]),
  }));

  return sections;
}

const FILLE_ID_PREFIX = "filler-";

function organisePostsIntoBento(posts: BentoPost[]): BentoRow[] {
  const rows: BentoRow[] = [];
  let pendingTiny: BentoPost | undefined = undefined;

  posts.forEach((post) => {
    if (post.size === "rectangle" || post.size === "big") {
      if (pendingTiny) {
        rows.push({
          id: "row-with-pending-tiny-" + post.id,
          type: "row_of_tinies",
          items: [
            pendingTiny,
            { type: "filler", id: FILLE_ID_PREFIX + post.id },
          ],
        });
        pendingTiny = undefined;
      }
      rows.push({
        id: "row_" + post.id,
        type: `row_${post.size}`,
        items: [post],
      });
    } else if (post.size === "tiny") {
      if (pendingTiny) {
        rows.push({
          id: "row_of_tinies_" + post.id,
          type: "row_of_tinies",
          items: [pendingTiny, post],
        });
        pendingTiny = undefined;
      } else {
        pendingTiny = post;
      }
    }
  });

  if (pendingTiny) {
    rows.push({
      id: "row_of_tinies_final",
      type: "row_of_tinies",
      items: [pendingTiny, { type: "filler", id: FILLE_ID_PREFIX + "end" }],
    });
  }

  return rows;
}
