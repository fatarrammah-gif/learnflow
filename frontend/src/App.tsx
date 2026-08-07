// App.tsx — the root component that provides global context to the entire app
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";

// QueryClient holds the in-memory cache for all API calls made via useQuery/useMutation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,  // Data stays "fresh" for 30 seconds before re-fetching
      retry: 1,           // Retry failed requests once before showing an error
    },
  },
});

export default function App() {
  return (
    // QueryClientProvider makes the queryClient available to all child components
    <QueryClientProvider client={queryClient}>
      {/* RouterProvider connects the app to our route definitions */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
