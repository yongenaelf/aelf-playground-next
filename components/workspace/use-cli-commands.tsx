"use client";
import { useLogs, useProposalInfo, useTransactionResult } from "@/data/client";
import { db } from "@/data/db";
import { useWallet } from "@/data/wallet";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { TerminalContext } from "react-terminal";
import { useWorkspaceId } from "./use-workspace-id";
import {
  AuditType,
  uploadContractCode,
  useAudit,
  useAuditReport,
} from "@/data/audit";
import clsx from "clsx";
import { fileContentToZip } from "@/lib/file-content-to-zip";
import { saveAs } from "file-saver";
import { useSetSearchParams } from "@/lib/set-search-params";
import { FormatErrors } from "./format-errors";
import { ShareLink } from "./share-link";

export function useCliCommands() {
  const terminalContext = useContext(TerminalContext);
  const pathname = usePathname();
  const id = useWorkspaceId();
  const setSearchParams = useSetSearchParams();

  const wallet = useWallet();
  const commands = {
    help: () => {
      terminalContext.setBufferedContent(
        <div>
          <p>These are the available commands:</p>
          <ol>
            <li className="ml-8">clear - clears the terminal</li>
            <li className="ml-8">
              audit - audits the current workspace using AI
            </li>
            <li className="ml-8">build - builds the current workspace</li>
            <li className="ml-8">test - tests the current workspace</li>
            <li className="ml-8">deploy - deploys the built smart contract</li>
            <li className="ml-8">export - exports the current workspace</li>
            <li className="ml-8">
              share - generates a share link for the current workspace
            </li>
            <li className="ml-8">
              check txID - checks the result of transaction
            </li>
          </ol>
        </div>
      );
    },
    audit: async (auditType: AuditType) => {
      const start = `${pathname}/`;
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
            <Loader2 className="h-4 w-4 animate-spin inline" /> Auditing...
          </p>
        </>
      );

      try {
        const codeHash = await uploadContractCode(auditType, files);

        terminalContext.setBufferedContent(
          <>
            <p>Code Hash: {codeHash}</p>
          </>
        );

        if (!wallet) return;

        setSearchParams({ auditId: codeHash, auditType });

        const { TransactionId } = await wallet.auditTransfer(codeHash);

        terminalContext.setBufferedContent(
          <>
            <AuditReport
              auditType={auditType}
              codeHash={codeHash}
              transactionId={TransactionId}
            />
          </>
        );
      } catch (err) {
        if (err instanceof Error)
          terminalContext.setBufferedContent(<p>Error: {err.message}</p>);
        return;
      }
    },
    build: async () => {
      if (typeof id !== "string") throw new Error("id is not string");
      await db.workspaces.update(id, { dll: undefined });
      const start = `${pathname}/`;
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
        console.log(dll, "-- build result");
        if (typeof dll === "string" && !error) {
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
    test: async () => {
      if (typeof id !== "string") throw new Error("id is not string");

      const start = `${pathname}/`;
      terminalContext.setBufferedContent(
        <>
          <p>Loading files...</p>
        </>
      );
      const files = (
        await db.files.filter((file) => file.path.startsWith(start)).toArray()
      ).map((file) => ({
        path: decodeURIComponent(file.path.replace(start, "")),
        contents: file.contents,
      }));

      terminalContext.setBufferedContent(
        <>
          <p>Loaded files: {files.map((i) => i.path).join(", ")}</p>
          <p>
            <Loader2 className="h-4 w-4 animate-spin inline" /> Running tests...
          </p>
        </>
      );

      try {
        const res = await fetch(`/api/test`, {
          method: "POST",
          body: JSON.stringify({ files }),
        });
        const { message } = await res.json();

        terminalContext.setBufferedContent(
          <FormatErrors inputString={message} />
        );
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
      const { dll, template } = (await db.workspaces.get(id)) || {};
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
      const { TransactionId } = await wallet.deploy(
        dll,
        template === "solidity" ? 1 : 0
      );
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
    export: async () => {
      if (typeof id !== "string") throw new Error("id is not string");
      const start = `${pathname}/`;
      terminalContext.setBufferedContent(
        <>
          <p>Loading files...</p>
        </>
      );
      const files = (
        await db.files.filter((file) => file.path.startsWith(start)).toArray()
      ).map((file) => ({
        path: decodeURIComponent(file.path.replace(start, "")),
        contents: file.contents,
      }));

      const zip = fileContentToZip(files);
      const file = new File(
        [zip],
        `${pathname?.split("/")?.pop() || "export"}.zip`,
        {
          type: "data:application/octet-stream;base64,",
        }
      );
      saveAs(file);
    },
    share: async () => {
      if (typeof id !== "string") throw new Error("id is not string");
      const start = `${pathname}/`;
      terminalContext.setBufferedContent(
        <>
          <p>Loading files...</p>
        </>
      );
      const files = (
        await db.files.filter((file) => file.path.startsWith(start)).toArray()
      ).map((file) => ({
        path: decodeURIComponent(file.path.replace(start, "")),
        contents: file.contents,
      }));

      terminalContext.setBufferedContent(
        <>
          <p>Loaded files: {files.map((i) => i.path).join(", ")}</p>
          <p>
            <Loader2 className="h-4 w-4 animate-spin inline" /> Generating share
            link...
          </p>
        </>
      );

      try {
        const res = await fetch(`/api/share`, {
          method: "POST",
          body: JSON.stringify({ files }),
        });
        const { id } = await res.json();

        terminalContext.setBufferedContent(<ShareLink id={id} />);
      } catch (err) {
        if (err instanceof Error)
          terminalContext.setBufferedContent(<>{err.message}</>);
        return;
      }
    },
  };

  return commands;
}

function Loading({ children }: PropsWithChildren) {
  return (
    <p>
      <Loader2 className="h-4 w-4 animate-spin inline" /> {children}
    </p>
  );
}

function Deploying() {
  return <Loading>Deploying...</Loading>;
}

function Deployment({ id }: { id: string }) {
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data, error } = useTransactionResult(
    id,
    shouldPoll ? 1000 : undefined
  );
  const { Status } = data || {};

  useEffect(() => {
    if (Status === "MINED" || !!error) setShouldPoll(false);
  }, [Status, error]);

  if (error) return <p>Error: {error.Error}</p>;
  if (!data || Status === "PENDING") return <Deploying />;

  return <CheckProposalId id={id} />;
}

function CheckProposalId({ id }: { id: string }) {
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data } = useLogs(id, shouldPoll ? 1000 : undefined);
  const { proposalId } = data || {};

  useEffect(() => {
    if (proposalId) setShouldPoll(false);
  }, [proposalId]);

  if (!proposalId) return <Deploying />;

  return <CheckProposalInfo id={proposalId} />;
}

function CheckProposalInfo({ id }: { id: string }) {
  const [shouldPoll, setShouldPoll] = useState(true);

  const { data: proposalInfo } = useProposalInfo(
    id,
    shouldPoll ? 1000 : undefined
  );
  const { status, releasedTxId } = proposalInfo?.proposal || {};

  useEffect(() => {
    if (status === "expired" || status === "released") setShouldPoll(false);
  }, [status]);

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractViewerAddress = searchParams.get("contract-viewer-address");

  if (!data) return <Deploying />;

  if(data?.address){
    if(!contractViewerAddress){
      router.replace(pathname + `?contract-viewer-address=${data.address}`);
    }
  }

  return <p>Contract Address: {data.address}</p>;
}

function AuditReport({
  auditType,
  codeHash,
  transactionId,
}: {
  auditType: AuditType;
  codeHash: string;
  transactionId: string;
}) {
  const { isLoading, error } = useAudit(auditType, codeHash, transactionId);

  if (isLoading || !!error) return <Loading>Loading report...</Loading>;

  return <AuditReportResult auditType={auditType} codeHash={codeHash} />;
}

function AuditReportResult({
  auditType,
  codeHash,
}: {
  auditType: AuditType;
  codeHash: string;
}) {
  const { data, isLoading } = useAuditReport(auditType, codeHash);

  if (isLoading || !data) return <Loading>Loading report...</Loading>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2">Suggestion</th>
          </tr>
        </thead>
        {Object.entries(data).map(([k, v]) => (
          <tr key={k} className="border border-black">
            <td className="p-2">{k}</td>
            <td className="p-2">
              {v.map((i, index) => (
                <div
                  key={index}
                  className={clsx("border border-black p-2", {
                    "border-t-0": index !== 0,
                  })}
                >
                  {i.Detail ? (
                    <>
                      <p>Original: {i.Detail.Original}</p>
                      <p>Suggested: {i.Detail.Updated}</p>
                    </>
                  ) : null}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </table>
    </>
  );
}
