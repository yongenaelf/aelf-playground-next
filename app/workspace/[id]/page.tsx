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
import FileExplorer from "@/components/file-explorer";
import ContractViewer from "@/components/contract-viewer";

export default function Page({params: {id}}: {params: {id: string}}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <ResizablePanel defaultSize={25} className="flex flex-col">
        <TopBottom
          top={
            <>
              <BuildDeployPanel />
              <FileExplorer />
            </>
          }
          bottom={<ContractViewer name={id}/>}
          topDefaultSize={30}
          bottomDefaultSize={70}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <TopBottom top={<Editor />} bottom={<Cli />} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
