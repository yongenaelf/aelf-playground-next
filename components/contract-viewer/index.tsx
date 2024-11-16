"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/data/wallet";
import { ContractView } from "aelf-smartcontract-viewer";
import { useTheme } from "next-themes";

const sideChainTestnetRpc = "https://tdvw-test-node.aelf.io";

const ContractViewer = ({ name }: { name: string }) => {
  const searchParams = useSearchParams();
  const wallet = useWallet();
  const { resolvedTheme } = useTheme();
  const contractViewerAddress = searchParams.get("contract-viewer-address");
  const [key, setKey] = useState("0");

  useEffect(() => {
    setTimeout(() => {
      setKey(prev => parseInt(prev) + 1 + "");
    }, 1000);
  }, [contractViewerAddress]);

  if (!contractViewerAddress || !wallet?.wallet) {
    return;
  }

  return (
    <ContractView
      key={key}
      wallet={wallet.wallet}
      address={contractViewerAddress}
      headerTitle={"Contract View"}
      rpcUrl={sideChainTestnetRpc}
      contractName={name}
      theme={resolvedTheme as "dark" | "light"}
    />
  );
};

export default ContractViewer;
