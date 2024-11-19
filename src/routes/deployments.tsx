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
import { Link } from "react-router-dom";
import { useContractList } from "@/data/graphql";

export function Component() {
  const wallet = useWallet();
  const { data, loading } = useContractList(wallet?.wallet.address);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Past deployments</h1>
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Date and time</TableHead>
            <TableHead className="w-1/3">Contract Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data.contractList.items
              .map((i) => (
                <TableRow key={i.address}>
                  <TableCell>{format(i.metadata.block.blockTime, "PPPppp")}</TableCell>
                  <TableCell>
                    <ViewAddressOnExplorer address={i.address} />
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

function ViewAddressOnExplorer({ address }: { address: string }) {
  return (
    <Link
      className="hover:underline"
      to={`https://testnet.aelfscan.io/tDVW/address/ELF_${address}_tDVW`}
      title="View on aelf Explorer"
      target="_blank"
      rel="noopener noreferrer"
    >
      AELF_{address}_tDVW
    </Link>
  );
}
