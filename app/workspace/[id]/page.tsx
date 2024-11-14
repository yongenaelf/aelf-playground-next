"use client";;
import { use } from "react";

import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import Editor from "@/components/workspace/editor";
import LeftSide from "@/components/left-side";

export default function Page(props: {params: Promise<{id: string}>}) {
  const params = use(props.params);

  const {
    id
  } = params;

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
