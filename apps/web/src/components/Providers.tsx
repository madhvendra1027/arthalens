"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000,           // Data considered fresh for 10s
            refetchInterval: 30 * 1000,     // Automatic continuous live refresh every 30s
            refetchOnWindowFocus: true,     // Immediately refresh when user returns to window
            refetchOnMount: true,           // Immediately refresh on navigation
            retry: 2,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
