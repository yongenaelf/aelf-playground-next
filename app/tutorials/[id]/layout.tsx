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
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
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
                <div className="h-full overflow-y-auto overflow-x-hidden">
                  {children}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          }
          bottom={<Cli />}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
