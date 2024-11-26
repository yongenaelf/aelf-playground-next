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
  topClassName = "",
  bottomClassName = "",
}: {
  top: ReactNode;
  bottom: ReactNode;
  topDefaultSize?: number;
  bottomDefaultSize?: number;
  topClassName?: string;
  bottomClassName?: string
}) {
  return (
    <div className="h-[calc(100vh-40px)]">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel
          defaultSize={topDefaultSize}
          className={`overflow-y-auto ${topClassName}`}
        >
          {top}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={bottomDefaultSize} className={bottomClassName}>
          {bottom}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
