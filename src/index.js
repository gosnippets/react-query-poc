import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2, // It will retry 2 more times to fetch the API
      refetchInterval: 1*60*1000, // In every 1 min it will refetch API
      staleTime: 3 * 60 * 1000,
      cacheTime: 10 * 60 * 1000, // Default cache time is 5 mins
    },
  },
});
// The above queries can also be used for particular useQuery also

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
