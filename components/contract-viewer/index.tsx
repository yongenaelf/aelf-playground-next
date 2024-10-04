"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/data/wallet";
import { ContractView } from "aelf-smartcontract-viewer";

const sideChainTestnetRpc = "https://explorer-test-side02.aelf.io/chain";

const ContractViewer = ({ name }: { name: string }) => {
  const searchParams = useSearchParams();
  const wallet = useWallet();
  const contractViewerAddress = searchParams.get("contract-viewer-address");

  if (!contractViewerAddress || !wallet?.wallet) {
    return;
  }

  return (
    <ContractView
      wallet={wallet.wallet}
      address={contractViewerAddress}
      headerTitle={"Contract View"}
      rpcUrl={sideChainTestnetRpc}
      contractName={name}
    />
  );
};

export default ContractViewer;
