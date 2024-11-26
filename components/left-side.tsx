import { useSearchParams } from "react-router-dom";

import { BuildDeployPanel } from "./build-deploy-panel";
import ContractViewer from "./contract-viewer";
import FileExplorer from "./file-explorer";
import TopBottom from "./top-bottom";
import { ResizablePanel } from "./ui/resizable";

const TopSections = () => (
  <div className="h-full">
    <BuildDeployPanel />
    <FileExplorer />
  </div>
);
const LeftSide = ({ name }: { name: string }) => {
  const [searchParams] = useSearchParams();
  const contractViewerAddress = searchParams.get("contract-viewer-address");

  return (
    <ResizablePanel defaultSize={25}>
      {contractViewerAddress ? (
        <TopBottom
          top={<TopSections />}
          bottom={<ContractViewer name={name} />}
          topDefaultSize={30}
          bottomDefaultSize={70}
          bottomClassName="contract-viewer-container"
        />
      ) : (
        <TopSections />
      )}
    </ResizablePanel>
  );
};

export default LeftSide;
