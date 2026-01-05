import { gql, useMutation } from "urql";

const REQUEST_FOLLOW_MUTATION = gql`
  mutation ($username: String!) {
    requestFollow(username: $username) {
      id
      status
      group
    }
  }
`;
const CANCEL_FOLLOW_MUTATION = gql`
  mutation ($username: String!) {
    cancelFollow(username: $username) {
      id
    }
  }
`;

export function useProfileConnection(
  username: string | string[],
  onSuccess: () => void
) {
  const [requestRes, requestFollow] = useMutation(REQUEST_FOLLOW_MUTATION);
  const [cancelRes, cancelFollow] = useMutation(CANCEL_FOLLOW_MUTATION);

  const isLoading = requestRes.fetching || cancelRes.fetching;

  const handleConnect = async () => {
    const result = await requestFollow({ username });
    if (result.error) {
      return alert(
        `Failed to send connection request. Please try again. ${result.error.message}`
      );
    }
    onSuccess();
  };

  const handleDisconnect = async () => {
    const result = await cancelFollow({ username });
    if (result.error) {
      return alert(
        `Failed to cancel connection request. Please try again. ${result.error.message}`
      );
    }
    onSuccess();
  };

  return {
    isLoading,
    handleConnect,
    handleDisconnect,
  };
}
