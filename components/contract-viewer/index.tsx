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
  const aelfWallet = wallet?.privateKey && AElf.wallet.getWalletByPrivateKey(wallet.privateKey);
  const contractViewerAddress = searchParams.get("contract-viewer-address");

  if (!contractViewerAddress || !aelfWallet) {
    return;
  }

  return (
    <ContractView
      wallet={aelfWallet}
      address={contractViewerAddress}
      headerTitle={"Contract View"}
      rpcUrl="https://explorer-test-side02.aelf.io/chain"
      contractName={contractName}
    />
  );
};

export default ContractViewer;
