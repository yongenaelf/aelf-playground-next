import TopBottom from "@/components/top-bottom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Cli from "@/components/workspace/cli";
import LeftSide from "@/components/left-side";
import { Outlet, useParams } from "react-router-dom";

export function Component() {
  let { id } = useParams();

  return (
    <ResizablePanelGroup direction="horizontal" className="border">
      <LeftSide name={id!} />
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <TopBottom top={<Outlet />} bottom={<Cli />} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
