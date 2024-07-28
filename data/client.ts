import useSWR from "swr";
import { db } from "./db";
import { aelf } from "./wallet";
import { ProposalInfo } from "./proposal-info-types";
import AElf from "aelf-sdk";
const { deserializeLog } = AElf.pbUtils;

export function useWorkspaces() {
  return useSWR("workspaces", async () => {
    return await db.workspaces.toArray();
  });
}

export function useTransactionResult(id?: string) {
  return useSWR(
    id ? `tx-${id}` : undefined,
    async () => await aelf.chain.getTxResult(id),
    { refreshInterval: 1000 }
  );
}

export function useProposalInfo(id?: string) {
  return useSWR(
    id ? `get-proposal-info-${id}` : undefined,
    async () => {
      const res = await fetch(`/api/get-proposal-info?id=${id}`);
      const { data }: ProposalInfo = await res.json();

      return data;
    },
    { refreshInterval: 1000 }
  );
}

export function useLogs(id?: string) {
  return useSWR(
    id ? `get-logs-${id}` : undefined,
    async () => {
      const txResult = await aelf.chain.getTxResult(id);

      const services = await Promise.all(
        txResult.Logs.map(async ({ Address }: { Address: string }) =>
          AElf.pbjs.Root.fromDescriptor(
            await aelf.chain.getContractFileDescriptorSet(Address)
          )
        )
      );

      const deserializedLogs: Array<{ proposalId: string }> =
        await deserializeLog(txResult.Logs, services);

      return deserializedLogs.reduce(
        (acc, cur) => ({ ...acc, ...cur }),
        {} as Record<string, string>
      );
    },
    { refreshInterval: 1000 }
  );
}
