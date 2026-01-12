import { gql, useMutation } from "urql";
import { useAuth } from "../context/AuthContext";

const PROFILE_UPDATE_MUTATION = gql`
  mutation ($userId: ID!, $data: UpdateProfileInput!) {
    updateProfile(userId: $userId, data: $data) {
      id
      bio
      firstName
      lastName
      avatar
      location
      fullName
    }
  }
`;

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
}

export function useUpdateProfile() {
  const [{ fetching }, updateProfile] = useMutation(PROFILE_UPDATE_MUTATION);
  const { user } = useAuth();

  const asyncUpdateProfile = async (data: UpdateProfileInput) => {
    if (!user) {
      alert("User not authenticated.");
      return null;
    }

    const response = await updateProfile({ data, userId: user.id });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data;
  };

  return { asyncUpdateProfile, isLoading: fetching };
}
