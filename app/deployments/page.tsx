"use client";

import { useWallet } from "@/data/wallet";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

export default function Page() {
  const wallet = useWallet();
  const { data } = useSWR(
    wallet ? `${wallet.wallet.address}-transactions` : undefined,
    () => wallet?.getTransactions()
  );

  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Past deployments</h1>
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Date and time</TableHead>
            <TableHead>Contract Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data
              .filter((i) => i.method === "DeployUserSmartContract")
              .map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{format(i.time, "PPPppp")}</TableCell>
                  <TableCell>
                    <ContractAddress id={i.tx_id} />
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell>Loading...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <h1 className="text-2xl mb-2">Wallet information</h1>
      <p>
        Wallet address: <ViewOnExplorer address={wallet?.wallet.address} />
      </p>
    </div>
  );
}

function ContractAddress({ id }: { id: string }) {
  const wallet = useWallet();

  const { data, error, isLoading } = useSWR(
    wallet ? `${id}-contract-address` : undefined,
    async () => {
      if (!wallet) return;
      const logs = await wallet.getLogs(id);
      if (typeof logs.proposalId !== "string") return;
      const proposalInfo = await wallet.getProposalInfo(logs.proposalId);
      const txId = proposalInfo.data.proposal.releasedTxId;
      const txResult = await wallet.getLogs(txId);
      return txResult.address;
    }
  );

  if (isLoading) return <span>Loading...</span>;
  if (error || !data) return <span>-</span>;

  return <ViewOnExplorer address={data} />;
}

function ViewOnExplorer({ address }: { address: string }) {
  return (
    <Link
      className="hover:underline"
      href={`https://explorer-test-side02.aelf.io/address/AELF_${address}_tDVW`}
      title="View on Explorer"
      target="_blank"
      rel="noopener noreferrer"
    >
      AELF_{address}_tDVW
    </Link>
  );
}
