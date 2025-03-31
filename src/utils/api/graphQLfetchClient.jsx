// Handles requests and responses from graphQL
// using the inbuilt fetch function.

export default function UseGraphQLAPI(query, variables) {
  const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URL;
  const GRAPHQL_URL_API_KEY = import.meta.env.VITE_GRAPHQL_URL_API_KEY;

  const fetchGraphQL = async (query, variables = {}) => {
    try {
      const response = await fetch(GRAPHQL_URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": GRAPHQL_URL_API_KEY,
        },
        body: JSON.stringify({ query, variables }),
      });
      const result = await response.json();
      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        throw new Error("GraphQL Error");
      }
      return result.data;
    } catch (error) {
      console.error("Error in fetchGraphQL:", error);
      throw error;
    }
  };

  return fetchGraphQL(query, variables);
}
