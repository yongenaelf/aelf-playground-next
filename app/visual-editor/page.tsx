import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { VisualEditorProvider } from "@/components/visual/context";
import { Preview } from "@/components/visual/preview";
import { SidePanel } from "@/components/visual/side-panel";

export default function Page() {
  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Visual Editor</h1>
      <VisualEditorProvider>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} className="pr-3">
            <SidePanel />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <Preview />
          </ResizablePanel>
        </ResizablePanelGroup>
      </VisualEditorProvider>
    </div>
  );
}
