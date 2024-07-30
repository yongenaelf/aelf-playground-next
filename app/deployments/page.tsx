"use client";

import { useWallet } from "@/data/wallet";
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
import { useLogs, useProposalInfo, useTransactions } from "@/data/client";

export default function Page() {
  const wallet = useWallet();
  const { data } = useTransactions(wallet?.wallet.address);

  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Past deployments</h1>
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Date and time</TableHead>
            <TableHead className="w-1/3">Contract Address</TableHead>
            <TableHead className="w-1/3">Proposal</TableHead>
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
                  <TableCell>
                    <Proposal id={i.tx_id} />
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
        Wallet address:{" "}
        <ViewAddressOnExplorer address={wallet?.wallet.address} />
      </p>
    </div>
  );
}

function Proposal({ id }: { id: string }) {
  const { data, isLoading, error } = useLogs(id);

  if (isLoading) return <span>Loading...</span>;
  if (error || !data || !data.proposalId) return <span>-</span>;

  return <ViewProposalOnExplorer id={data.proposalId} />;
}

function ContractAddress({ id }: { id: string }) {
  const { data: logs } = useLogs(id);
  const { data: info } = useProposalInfo(logs?.proposalId);
  const { data, isLoading, error } = useLogs(info?.proposal.releasedTxId);

  if (isLoading) return <span>Loading...</span>;
  if (error || !data) return <span>-</span>;

  return <ViewAddressOnExplorer address={data.address} />;
}

function ViewAddressOnExplorer({ address }: { address: string }) {
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

function ViewProposalOnExplorer({ id }: { id: string }) {
  return (
    <Link
      className="hover:underline"
      href={`https://explorer-test-side02.aelf.io/proposal/proposalsDetail/${id}`}
      title="View on Explorer"
      target="_blank"
      rel="noopener noreferrer"
    >
      {id}
    </Link>
  );
}
