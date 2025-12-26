import { BentoPost } from "../types/bento";

export const RAW_POSTS: BentoPost[] = [
  // --- JANUARY 2025 ---
  {
    id: "post-01",
    size: "big",
    post_date: "2025-01-15T10:00:00",
    img: "https://picsum.photos/800/800?random=1",
    type: "image",
    caption: "A big post example",
  },
  {
    id: "post-02",
    size: "tiny",
    post_date: "2025-01-14T14:30:00",
    img: "https://picsum.photos/400/400?random=2",
    type: "image",
    caption: "A tiny post example",
  },
  {
    id: "post-03",
    size: "tiny",
    post_date: "2025-01-14T09:15:00",
    img: "https://picsum.photos/400/400?random=3",
    type: "image",
    caption: "Another tiny post",
  },
  {
    id: "post-04",
    size: "rectangle",
    post_date: "2025-01-12T18:00:00",
    img: "https://picsum.photos/800/400?random=4",
    type: "image",
    caption: "A rectangle post",
  },
  {
    id: "post-05",
    size: "tiny",
    post_date: "2025-01-10T11:00:00",
    img: "https://picsum.photos/400/400?random=5",
    type: "image",
    caption: "Lone tiny post",
  },
  // Note: Post-05 is a lone tiny post at the end of Jan -> Should trigger a Filler!

  // --- DECEMBER 2024 ---
  {
    id: "post-06",
    size: "rectangle",
    post_date: "2024-12-25T08:00:00", // Christmas Morning
    img: "https://picsum.photos/800/400?random=6",
    type: "image",
    caption: "Christmas vibes",
  },
  {
    id: "post-07",
    size: "big",
    post_date: "2024-12-24T20:00:00", // Christmas Eve
    img: "https://picsum.photos/800/800?random=7",
    type: "image",
    caption: "Christmas Eve celebration",
  },
  {
    id: "post-08",
    size: "tiny",
    post_date: "2024-12-20T15:45:00",
    img: "https://picsum.photos/400/400?random=8",
    type: "image",
    caption: "Winter walk",
  },
  {
    id: "post-09",
    size: "tiny",
    post_date: "2024-12-20T15:40:00",
    img: "https://picsum.photos/400/400?random=9",
    type: "image",
    caption: "Cozy fireplace",
  },
  {
    id: "post-10",
    size: "rectangle",
    post_date: "2024-12-15T12:00:00",
    img: "https://picsum.photos/800/400?random=10",
    type: "image",
    caption: "Holiday market",
  },
  {
    id: "post-11",
    size: "tiny",
    post_date: "2024-12-10T09:00:00",
    img: "https://picsum.photos/400/400?random=11",
    type: "image",
    caption: "Snowy day",
  },
  {
    id: "post-12",
    size: "tiny",
    post_date: "2024-12-05T16:20:00",
    img: "https://picsum.photos/400/400?random=12",
    type: "image",
    caption: "Hot chocolate time",
  },

  // --- NOVEMBER 2024 ---
  {
    id: "post-13",
    size: "big",
    post_date: "2024-11-28T10:00:00",
    img: "https://picsum.photos/800/800?random=13",
    type: "image",
    caption: "Thanksgiving memories",
  },
  {
    id: "post-14",
    size: "tiny",
    post_date: "2024-11-25T14:00:00",
    img: "https://picsum.photos/400/400?random=14",
    type: "image",
    caption: "Autumn leaves",
  },
  {
    id: "post-15",
    size: "rectangle",
    post_date: "2024-11-20T11:30:00",
    img: "https://picsum.photos/800/400?random=15",
    type: "image",
    caption: "City skyline",
  },
  {
    id: "post-16",
    size: "tiny",
    post_date: "2024-11-15T09:00:00",
    img: "https://picsum.photos/400/400?random=16",
    type: "image",
    caption: "Morning jog",
  },
  {
    id: "post-17",
    size: "tiny",
    post_date: "2024-11-14T18:45:00",
    img: "https://picsum.photos/400/400?random=17",
    type: "image",
    caption: "Evening thoughts",
  },
  {
    id: "post-18",
    size: "tiny",
    post_date: "2024-11-10T12:00:00",
    img: "https://picsum.photos/400/400?random=18",
    type: "image",
    caption: "Lone tiny post in Nov",
  },
  // Note: Post-18 is lone tiny. Next is a big post. Should trigger a Filler!

  {
    id: "post-19",
    size: "big",
    post_date: "2024-11-05T08:30:00",
    img: "https://picsum.photos/800/800?random=19",
    type: "image",
    caption: "Morning sunrise",
  },
  {
    id: "post-20",
    size: "rectangle",
    post_date: "2024-11-01T20:00:00",
    img: "https://picsum.photos/800/400?random=20",
    type: "image",
    caption: "City lights",
  },
];
