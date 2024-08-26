"use client";

import { useTheme } from "next-themes";
import { ReactTerminal } from "react-terminal";
import { useCliCommands } from "./use-cli-commands";

export default function Cli() {
  const commands = useCliCommands();

  const { theme, systemTheme } = useTheme();

  return (
    <div className="h-full pb-8">
      <ReactTerminal
        commands={commands}
        prompt="#"
        theme={theme !== "system" ? theme : systemTheme}
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
