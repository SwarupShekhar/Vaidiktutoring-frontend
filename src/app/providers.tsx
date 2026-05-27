"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import StyledComponentsRegistry from "./lib/registry";
import { CurriculumProvider } from "./context/CurriculumContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );

  // ThemeProvider with suppressHydrationWarning on <html> (set in layout.tsx)
  // handles the dark/light flash — no need for a mounted guard + double render.
  return (
    <StyledComponentsRegistry>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>
          <CurriculumProvider>
            {children}
            <Toaster richColors position="top-center" />
          </CurriculumProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
