import { gql, useMutation } from "urql";
import { useAuth } from "../context/AuthContext";

const POST_CREATE_MUTATION = gql`
  mutation ($img: String!, $caption: String!, $size: String!, $type: String!) {
    createPost(img: $img, caption: $caption, size: $size, type: $type) {
      id
      caption
      img
      size
      type
      author {
        id
        username
      }
    }
  }
`;

interface CreatePostData {
  img: string;
  caption: string;
  size: string;
}

export function useCreatePost() {
  const [result, createPost] = useMutation(POST_CREATE_MUTATION);
  const { user } = useAuth();

  const asyncCreatePost = async ({ img, caption, size }: CreatePostData) => {
    if (!user || !img) {
      alert("Missing information to create post.");
      return false;
    }

    try {
      const mockURL = `https://picsum.photos/800/800?random=${Date.now()}`;
      const response = await createPost({
        img: mockURL,
        size,
        caption: caption || "New drop created from mobile app",
        type: "image",
      });
      if (response.error) {
        alert("Error creating post: " + response.error.message);
        return false;
      }
      return true;
    } catch (error) {
      alert("Error creating post: " + error);
      return false;
    }
  };

  return { asyncCreatePost, isLoading: result.fetching };
}
