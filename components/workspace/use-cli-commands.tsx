import { useLogs, useProposalInfo, useTransactionResult } from "@/data/client";
import { db } from "@/data/db";
import { useWallet } from "@/data/wallet";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { TerminalContext } from "react-terminal";

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
        const res = await fetch(`/api/build`, {
          method: "POST",
          body: JSON.stringify({ files }),
        });
        const { dll, error } = await res.json();
        if (typeof dll === "string") {
          await db.workspaces.update(id, { dll });
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
              <p>{error}</p>
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
      terminalContext.setBufferedContent(
        <>
          <p>TransactionId: {TransactionId}</p>
          <Deployment id={TransactionId} />
        </>
      );
    },
    check: async (id: string) => {
      if (!id) return `Please enter the Transaction ID.`;
      if (!wallet) return "Wallet not ready.";
      terminalContext.setBufferedContent(
        <>
          <p>TransactionId: {id}</p>
          <Deployment id={id} />
        </>
      );
    },
  };

  return commands;
}

function Deploying() {
  return (
    <p>
      <Loader2 className="h-4 w-4 animate-spin inline" /> Deploying...
    </p>
  );
}

function Deployment({ id }: { id: string }) {
  const { data } = useTransactionResult(id);

  if (!data)
    return (
      <>
        <Deploying />
      </>
    );
  if (data.Status === "PENDING") return <Deploying />;

  return <CheckProposalInfo id={id} />;
}

function CheckProposalInfo({ id }: { id: string }) {
  const { data } = useLogs(id);
  const { proposalId } = data || {};

  const { data: proposalInfo } = useProposalInfo(proposalId);
  const { status, releasedTxId } = proposalInfo?.proposal || {};

  return (
    <>
      <p>Proposal status: {status || "pending"}</p>
      {status === "released" ? (
        <DeployedContractDetails id={releasedTxId} />
      ) : (
        <Deploying />
      )}
    </>
  );
}

function DeployedContractDetails({ id }: { id?: string }) {
  const { data } = useLogs(id);

  if (!data) return <Deploying />;

  return <p>Contract Address: {data.address}</p>;
}
