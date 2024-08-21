"use client";

import { useTheme } from "next-themes";
import { ReactTerminal } from "react-terminal";
import { useCliCommands } from "./use-cli-commands";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NodeTerminal } from "../webcontainer";
import { LoadFiles } from "../webcontainer/load-files";

export default function Cli() {
  const commands = useCliCommands();

  const { theme, systemTheme } = useTheme();

  return (
    <div className="h-full pb-8">
      <Tabs defaultValue="default" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="nodejs">NodeJS</TabsTrigger>
        </TabsList>
        <TabsContent value="default" className="h-full mt-0">
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
        </TabsContent>
        <TabsContent value="nodejs">
          <LoadFiles />
          <NodeTerminal />
        </TabsContent>
      </Tabs>
    </div>
  );
}
