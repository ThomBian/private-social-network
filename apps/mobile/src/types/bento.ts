import { Post as BentoPost } from "@social/types";

type BentoRowRectangle = {
  type: "row_rectangle";
  items: [BentoPost];
  id: string;
};
type BentoRowOfTinies = {
  type: "row_of_tinies";
  items: [BentoPost, BentoPost];
  id: string;
};

type BentoRowSquare = {
  type: "row_square";
  items: [BentoPost];
  id: string;
};

export type BentoRow = BentoRowRectangle | BentoRowOfTinies | BentoRowSquare;
export type BentoSection = {
  title: string;
  data: BentoRow[];
};
