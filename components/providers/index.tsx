"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { InversifyProvider } from "@/di/providers";
import { TerminalContextProvider } from "react-terminal";
import WebContainerProvider from "../webcontainer";

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
        <WebContainerProvider>
          <TerminalContextProvider>{children}</TerminalContextProvider>
        </WebContainerProvider>
      </InversifyProvider>
    </ThemeProvider>
  );
}
