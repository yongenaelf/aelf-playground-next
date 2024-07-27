import { build } from "@/data/build";
import { db } from "@/data/db";
import { useWallet } from "@/data/wallet";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { TerminalContext } from "react-terminal";
import { z } from "zod";

export function useCliCommands() {
  const terminalContext = useContext(TerminalContext);

  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();
  const commands = {
    help: () => {
      terminalContext.setBufferedContent(
        <div>
          <p>These are the available commands:</p>
          <ol>
            <li className="ml-8">clear - clears the terminal</li>
            <li className="ml-8">build - builds the current workspace</li>
            <li className="ml-8">deploy - deploys the built smart contract</li>
            <li className="ml-8">
              check txID - checks the result of transaction
            </li>
          </ol>
        </div>
      );
    },
    build: async () => {
      if (typeof id !== "string") throw new Error("id is not string");
      await db.workspaces.update(id, { dll: undefined });
      const start = `/workspace/${id}/`;
      terminalContext.setBufferedContent(
        <>
          <p>Loading files...</p>
        </>
      );
      const files = (
        await db.files.filter((file) => file.path.startsWith(start)).toArray()
      )
        .map((file) => ({
          path: decodeURIComponent(file.path.replace(start, "")),
          contents: file.contents,
        }))
        .filter((i) => i.path.startsWith("src"));

      terminalContext.setBufferedContent(
        <>
          <p>Loaded files: {files.map((i) => i.path).join(", ")}</p>
          <p>
            <Loader2 className="h-4 w-4 animate-spin inline" /> Building...
          </p>
        </>
      );

      try {
        const str = await build(files);
        if (typeof str === "string") {
          await db.workspaces.update(id, { dll: str });
          terminalContext.setBufferedContent(
            <>
              <p>Build successful.</p>
            </>
          );
          return;
        } else {
          terminalContext.setBufferedContent(
            <>
              {terminalContext.bufferedContent}
              <p>Build failed.</p>
            </>
          );
          return;
        }
      } catch (err) {
        if (err instanceof Error)
          terminalContext.setBufferedContent(<>{err.message}</>);
        return;
      }
    },
    deploy: async () => {
      if (typeof id !== "string") {
        terminalContext.setBufferedContent(
          <>
            <p>Workspace {id} not found.</p>
          </>
        );
        return;
      }
      const { dll } = (await db.workspaces.get(id)) || {};
      if (!dll) {
        terminalContext.setBufferedContent(
          <>
            <p>Contract not built.</p>
          </>
        );
        return;
      }
      if (!wallet) {
        terminalContext.setBufferedContent(
          <>
            <p>Wallet not ready.</p>
          </>
        );
        return;
      }
      const { TransactionId } = await wallet.deploy(dll);
      try {
        const result = await wallet.getTxResult(TransactionId);
        terminalContext.setBufferedContent(
          <>
            <p>TransactionId: {TransactionId}</p>
            <p>Status: {result.Status}</p>
            <p>
              <Link href="/deployments">See all deployments</Link>
            </p>
          </>
        );
        return;
      } catch (err) {
        terminalContext.setBufferedContent(
          <>
            {JSON.stringify(err, undefined, 2)}
            <br />
          </>
        );
        return;
      }
    },
    check: async (id: string) => {
      if (!id) return `Please enter the Transaction ID.`;
      if (!wallet) return "Wallet not ready.";
      try {
        const result = await wallet.getTxResult(id);
        const logs = await wallet.getLogs(id);
        const { data } = z.object({ proposalId: z.string() }).safeParse(logs);
        if (!data?.proposalId) return "Missing proposalId.";
        const proposalInfo = await wallet.getProposalInfo(data?.proposalId);
        const releasedTxId = proposalInfo?.data.proposal.releasedTxId;
        const releasedTxLogs = releasedTxId
          ? await wallet.getLogs(releasedTxId)
          : undefined;
        const { data: contractAddressData } = z
          .object({ address: z.string() })
          .safeParse(releasedTxLogs);

        return (
          <>
            <table className="mt-4">
              <tr>
                <td className="pr-4">TransactionId:</td>
                <td>{id}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{result.Status}</td>
              </tr>
              <tr>
                <td>ProposalId:</td>
                <td>{data?.proposalId}</td>
              </tr>
              <tr>
                <td>Proposal Status:</td>
                <td>{proposalInfo?.data.proposal.status}</td>
              </tr>
              <tr>
                <td>Contract Address:</td>
                <td>
                  {proposalInfo?.data.proposal.status === "released"
                    ? contractAddressData?.address
                    : "-"}
                </td>
              </tr>
            </table>
          </>
        );
      } catch (err) {
        return JSON.stringify(err, undefined, 2);
      }
    },
  };

  return commands;
}
