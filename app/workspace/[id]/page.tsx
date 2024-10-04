"use client";

import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import LeftSide from "@/components/left-side";

export default function Page({params: {id}}: {params: {id: string}}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <LeftSide name={id} />
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <TopBottom top={<Editor />} bottom={<Cli />} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
