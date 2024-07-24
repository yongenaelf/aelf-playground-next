"use client";

import { build } from "@/data/build";
import { db } from "@/data/db";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { ReactTerminal } from "react-terminal";

export default function Cli() {
  const { id } = useParams();
  const commands = {
    whoami: "jackharper",
    cd: (directory: string) => `changed path to ${directory}`,
    help: () => (
      <div>
        <p>These are the available commands:</p>
        <ol>
          <li className="ml-8">clear - clears the terminal</li>
          <li className="ml-8">build - builds the current workspace</li>
        </ol>
      </div>
    ),
    build: async () => {
      if (typeof id !== "string") throw new Error("id is not string");
      const start = `/workspace/${id}/`;
      const files = await db.files
        .filter((file) => file.path.startsWith(start))
        .toArray();
      const params = files
        .map((file) => ({
          path: decodeURIComponent(file.path.replace(start, "")),
          contents: file.contents,
        }))
        .filter((i) => i.path.startsWith("src"));
      console.log(params);

      const str = await build(params);
      await db.workspaces.update(id, { dll: str });

      return "Build successful.";
    },
  };

  const { theme, systemTheme } = useTheme();

  return (
    <ReactTerminal
      commands={commands}
      prompt="#"
      theme={theme !== "system" ? theme : systemTheme}
      showControlBar={false}
      welcomeMessage={
        <div>
          <p>Welcome to AElf Playground.</p>
          <p>Type help to see all commands.</p>
        </div>
      }
    />
  );
}
