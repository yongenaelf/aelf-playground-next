"use client";

import { useTheme } from "next-themes";
import { ReactTerminal } from "react-terminal";

export default function Cli() {
  const commands = {
    whoami: "jackharper",
    cd: (directory: string) => `changed path to ${directory}`,
  };

  const { theme, systemTheme } = useTheme();

  return (
    <ReactTerminal
      commands={commands}
      prompt="#"
      theme={theme !== "system" ? theme : systemTheme}
      showControlBar={false}
    />
  );
}
