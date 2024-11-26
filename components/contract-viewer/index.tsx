"use client";

import { useSearchParams } from "react-router-dom";
import { useWallet } from "@/data/wallet";
import { ContractView } from "aelf-smartcontract-viewer";
import { useTheme } from "@/components/providers/theme-provider";

const sideChainTestnetRpc = "https://tdvw-test-node.aelf.io";

const ContractViewer = ({ name }: { name: string }) => {
  const [searchParams] = useSearchParams();
  const wallet = useWallet();
  const { resolvedTheme } = useTheme();
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
      theme={resolvedTheme as "dark" | "light"}
    />
  );
};

export default ContractViewer;
