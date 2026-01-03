import { createClient, cacheExchange, fetchExchange } from "urql";

const createUrqlClient = (token: string | null) => {
  return createClient({
    url: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/graphql",
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  });
};

export default createUrqlClient;
