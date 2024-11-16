"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/data/wallet";
import { ContractView } from "aelf-smartcontract-viewer";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const sideChainTestnetRpc = "https://tdvw-test-node.aelf.io";

const ContractViewer = ({ name }: { name: string }) => {
  const searchParams = useSearchParams();
  const wallet = useWallet();
  const { resolvedTheme } = useTheme();
  const contractViewerAddress = searchParams.get("contract-viewer-address");
  const [key, setKey] = useState("0");

  if (!contractViewerAddress || !wallet?.wallet) {
    return;
  }

  return (
    <>
      <div className="flex">
        <Button className="mx-auto mt-2" onClick={() => setKey(prev => parseInt(prev) + 1 + "")}>Refresh</Button>
      </div>
      <ContractView
        key={key}
        wallet={wallet.wallet}
        address={contractViewerAddress}
        headerTitle={"Contract View"}
        rpcUrl={sideChainTestnetRpc}
        contractName={name}
        theme={resolvedTheme as "dark" | "light"}
      />
    </>
  );
};

export default ContractViewer;
