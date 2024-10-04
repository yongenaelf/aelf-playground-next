"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useWallet } from "@/data/wallet";
import AElf from "aelf-sdk";
import { ContractView } from "aelf-smartcontract-viewer";

const ContractViewer = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const contractName = pathName.split("/")[2];

  const wallet = useWallet();
  const [treeHeight, setTreeHeight] = useState(0);

  const aelfWallet =
    wallet?.privateKey && AElf.wallet.getWalletByPrivateKey(wallet.privateKey);
  const contractViewerAddress = searchParams.get("contract-viewer-address");

  const setFileContainerHeight = () => {
    const treeElement = document.querySelector(".file-tree");
    if (treeElement) {
      setTreeHeight(treeElement.clientHeight);
      const resizeObserver = new ResizeObserver((entries) => {
        setTreeHeight(treeElement.clientHeight);
      });
      resizeObserver.observe(treeElement);
      return () => {
        resizeObserver.disconnect();
      };
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      setTimeout(() => setFileContainerHeight(), 500);
    }
  }, []);

  if (!contractViewerAddress || !aelfWallet) {
    return;
  }

  return (
    <div style={{height: `calc(100% - ${treeHeight + 134}px)`}} className="border-t-2 mt-[20px]">
      <ContractView
        wallet={aelfWallet}
        address={contractViewerAddress}
        headerTitle={"Contract View"}
        rpcUrl="https://explorer-test-side02.aelf.io/chain"
        contractName={contractName}
      />
    </div>
  );
};

export default ContractViewer;
