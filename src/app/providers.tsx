"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
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

  // Fix hydration mismatch for theme
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <StyledComponentsRegistry>
        <QueryClientProvider client={queryClient}>
          <CurriculumProvider>
            {children}
          </CurriculumProvider>
        </QueryClientProvider>
      </StyledComponentsRegistry>
    );
  }

  return (
    <StyledComponentsRegistry>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
