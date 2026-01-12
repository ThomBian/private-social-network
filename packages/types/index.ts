export interface Post {
  id: string;
  img: string;
  post_date: string;
  size: "square" | "rectangle";
  type: "image";
  caption: string;
  author: User;
}

interface UserProfile {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  location: string | null;
  bio: string | null;
}

export interface User {
  id: string;
  username: string;
  profile: UserProfile | null;
}
