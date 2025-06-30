"use client";

import * as React from "react";
import { Toaster } from "sonner";
import StoreProvider from "@/redux/store/StoreProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/commonUi/ThemeProvider";

export interface ProvidersProps {
  children: React.ReactNode;
}
const queryClient = new QueryClient();
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </StoreProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
