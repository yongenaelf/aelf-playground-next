"use client";

import { BuildDeployPanel } from "@/components/build-deploy-panel";
import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Preview } from "@/components/webcontainer";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import FileExplorer from "@/components/workspace/file-explorer";

export default function Page() {
  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <ResizablePanel defaultSize={25}>
        <BuildDeployPanel />
        <FileExplorer />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <TopBottom
          top={
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50}>
                <Editor />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <Preview />
              </ResizablePanel>
            </ResizablePanelGroup>
          }
          bottom={<Cli />}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
