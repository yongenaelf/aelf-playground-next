import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { TerminalContextProvider } from "react-terminal";
import { ApolloWrapper } from "./apollo-wrapper";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-ui-theme"
    >
      <ApolloWrapper>
        <TerminalContextProvider>{children}</TerminalContextProvider>
      </ApolloWrapper>
    </ThemeProvider>
  );
}
