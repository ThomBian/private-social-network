export interface Post {
  id: string;
  img: string;
  post_date: string;
  size: "square" | "rectangle";
  type: "image";
  caption: string;
  author: User;
}

export interface User {
  id: string;
  username: string;
}
