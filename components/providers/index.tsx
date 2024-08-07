"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { InversifyProvider } from "@/di/providers";
import { TerminalContextProvider } from "react-terminal";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="next-theme"
    >
      <InversifyProvider>
        <TerminalContextProvider>{children}</TerminalContextProvider>
      </InversifyProvider>
    </ThemeProvider>
  );
}
