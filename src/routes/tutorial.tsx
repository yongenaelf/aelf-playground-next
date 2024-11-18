import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Editor from "@/components/workspace/editor";
import { PropsWithChildren } from "react";
import './tutorial.scss';

export default function Tutorial({ children }: PropsWithChildren) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <Editor />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="h-full overflow-y-auto overflow-x-hidden p-8 mdx-content">
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
