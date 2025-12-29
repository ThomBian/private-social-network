import { BentoRow } from "../types/bento";
import { Post as BentoPost } from "@social/types";

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

function organisePostsIntoBento(posts: BentoPost[]): BentoRow[] {
  const rows: BentoRow[] = [];
  let pendingSquare: BentoPost | undefined = undefined;

  posts.forEach((post) => {
    if (post.size === "rectangle") {
      if (pendingSquare) {
        rows.push({
          id: "row-with-pending-tiny-" + post.id,
          type: "row_square",
          items: [pendingSquare],
        });
        pendingSquare = undefined;
      }
      rows.push({
        id: "row_" + post.id,
        type: `row_${post.size}`,
        items: [post],
      });
    } else if (post.size === "square") {
      if (pendingSquare) {
        rows.push({
          id: "row_of_tinies_" + post.id,
          type: "row_of_tinies",
          items: [pendingSquare, post],
        });
        pendingSquare = undefined;
      } else {
        pendingSquare = post;
      }
    }
  });

  if (pendingSquare) {
    rows.push({
      id: "row_of_tinies_final",
      type: "row_square",
      items: [pendingSquare],
    });
  }

  return rows;
}
