import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode } from "react";

export default function TopBottom({
  top,
  bottom,
  topDefaultSize = 70,
  bottomDefaultSize = 30,
}: {
  top: ReactNode;
  bottom: ReactNode;
  topDefaultSize?: number;
  bottomDefaultSize?: number;
}) {
  return (
    <div className="h-[calc(100vh-40px)]">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel
          defaultSize={topDefaultSize}
          className="overflow-y-auto"
        >
          {top}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={bottomDefaultSize}>
          {bottom}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
