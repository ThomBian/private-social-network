import { Post as BentoPost } from "@social/types";

export interface BentoFiller {
  type: "filler";
  id: string;
}

export type BentoItem = BentoPost | BentoFiller;

type BentoRowBig = { type: "row_big"; items: [BentoPost]; id: string };
type BentoRowRectangle = {
  type: "row_rectangle";
  items: [BentoPost];
  id: string;
};
type BentoRowOfTinies = {
  type: "row_of_tinies";
  items: [BentoItem, BentoItem];
  id: string;
};

export type BentoRow = BentoRowBig | BentoRowRectangle | BentoRowOfTinies;

export type BentoSection = {
  title: string;
  data: BentoRow[];
};
