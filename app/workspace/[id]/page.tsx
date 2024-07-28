"use client";

import { BuildDeployPanel } from "@/components/build-deploy-panel";
import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import FileExplorer from "@/components/workspace/file-explorer";
import { TerminalContextProvider } from "react-terminal";

export default function Page() {
  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <TerminalContextProvider>
        <ResizablePanel defaultSize={25}>
          <BuildDeployPanel />
          <FileExplorer />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <TopBottom top={<Editor />} bottom={<Cli />} />
        </ResizablePanel>
      </TerminalContextProvider>
    </ResizablePanelGroup>
  );
}
