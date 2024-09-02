import { BuildDeployPanel } from "@/components/build-deploy-panel";
import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import NodeTerminal from "@/components/webcontainer/node-terminal";
import Editor from "@/components/workspace/editor";
import FileExplorer from "@/components/file-explorer";

export default function Page() {
  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <ResizablePanel defaultSize={25}>
        <BuildDeployPanel />
        <FileExplorer />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <TopBottom top={<Editor />} bottom={<NodeTerminal />} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
