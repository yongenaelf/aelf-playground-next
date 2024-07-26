"use client";

import useSWR from "swr";
import { db } from "./db";
// @ts-ignore
import AElf from "aelf-sdk";
import BigNumber from "bignumber.js";
import { ProposalInfo } from "./proposal-info-types";
import { Transactions } from "./transactions-types";
const { deserializeLog } = AElf.pbUtils;

const aelf = new AElf(
  new AElf.providers.HttpProvider("https://tdvw-test-node.aelf.io")
);

export function useWallet() {
  const { data: privateKey } = useSWR("wallet", async () => {
    const existingWallets = await db.wallet.toArray();

    if (existingWallets.length === 0) {
      const newWallet = AElf.wallet.createNewWallet();
      await db.wallet.add({ privateKey: newWallet.privateKey });
      try {
        await(
          await fetch(
            `https://faucet.aelf.dev/api/claim?walletAddress=${newWallet.address}`,
            { method: "POST" }
          )
        ).json();
      } catch (err) {}
      return newWallet.privateKey as string;
    } else {
      return existingWallets[0].privateKey;
    }
  });

  if (!privateKey) return;

  return new Wallet(privateKey);
}

class Wallet {
  privateKey;
  wallet;
  cached: Record<string, any> = {};

  constructor(privateKey: string) {
    this.privateKey = privateKey;
    this.wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
  }

  async faucet() {
    const res = await fetch(
      `https://faucet.aelf.dev/api/claim?walletAddress=${this.wallet.address}`,
      { method: "POST" }
    );

    const data = await res.json();
    console.log(data);
  }

  private async getChainStatus() {
    return await aelf.chain.getChainStatus();
  }

  private getContract(address: string) {
    return aelf.chain.contractAt(address, this.wallet);
  }

  private async getGenesisContract() {
    const chainStatus = await this.getChainStatus();
    return await this.getContract(chainStatus.GenesisContractAddress);
  }

  private async getContractAddressByName(name: string) {
    const genesisContract = await this.getGenesisContract();
    return await genesisContract.GetContractAddressByName.call(
      AElf.utils.sha256(name)
    );
  }

  private async getTokenContractAddress() {
    return await this.getContractAddressByName(`AElf.ContractNames.Token`);
  }

  private async getTokenContract() {
    const tokenContractAddress = await this.getTokenContractAddress();

    return this.getContract(tokenContractAddress);
  }

  async getBalance() {
    const tokenContract = await this.getTokenContract();
    const res = await tokenContract.GetBalance.call({
      symbol: "ELF",
      owner: this.wallet.address,
    });

    return new BigNumber(res.balance).dividedBy(10 ** 8).toFixed(5);
  }

  async deploy(code: string): Promise<{ TransactionId: string }> {
    const genesisContract = await this.getGenesisContract();

    return await genesisContract.DeployUserSmartContract({
      category: 0,
      code,
    });
  }

  async getTxResult(
    id: string
  ): Promise<{ TransactionId: string; Status: string }> {
    return await aelf.chain.getTxResult(id);
  }

  private async getProto(address: string) {
    const key = aelf.currentProvider.host + "_" + address;
    if (!this.cached[key])
      this.cached[key] = await aelf.chain.getContractFileDescriptorSet(address);
    return AElf.pbjs.Root.fromDescriptor(this.cached[key]);
  }

  async getLogs(txId: string) {
    const txResult = await aelf.chain.getTxResult(txId);

    const services = await Promise.all(
      txResult.Logs.map(
        async ({ Address }: { Address: string }) => await this.getProto(Address)
      )
    );

    const deserializedLogs: Array<{ proposalId: string }> =
      await deserializeLog(txResult.Logs, services);

    return deserializedLogs.reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      {} as Record<string, string>
    );
  }

  async getProposalInfo(proposalId: string) {
    const res = await fetch(`/api/get-proposal-info?id=${proposalId}`);
    const data: ProposalInfo = await res.json();

    return data;
  }

  async getTransactions() {
    const res = await fetch(
      `/api/get-transactions?address=${this.wallet.address}`
    );
    const { transactions }: { transactions: Transactions } = await res.json();

    return transactions;
  }
}