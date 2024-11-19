"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { ReactTerminal } from "react-terminal";
import { useCliCommands } from "./use-cli-commands";

export default function Cli() {
  const commands = useCliCommands();

  const { resolvedTheme } = useTheme();

  return (
    <div className="h-full pb-8">
      <ReactTerminal
        commands={commands}
        prompt="#"
        theme={resolvedTheme}
        showControlBar={false}
        welcomeMessage={
          <div>
            <p>Welcome to aelf Playground.</p>
            <p>Type help to see all commands.</p>
          </div>
        }
      />
    </div>
  );
}
