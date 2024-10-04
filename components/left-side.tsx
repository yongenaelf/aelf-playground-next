import { BuildDeployPanel } from "./build-deploy-panel";
import ContractViewer from "./contract-viewer";
import FileExplorer from "./file-explorer";
import TopBottom from "./top-bottom";
import { ResizablePanel } from "./ui/resizable";

const LeftSide = ({ name }: { name: string }) => (
  <ResizablePanel defaultSize={25}>
    <TopBottom
      top={
        <>
          <BuildDeployPanel />
          <FileExplorer />
        </>
      }
      bottom={<ContractViewer name={name} />}
      topDefaultSize={30}
      bottomDefaultSize={70}
    />
  </ResizablePanel>
);

export default LeftSide;
