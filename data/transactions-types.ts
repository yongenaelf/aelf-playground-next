export type Transactions = Array<{
  id: number;
  tx_id: string;
  params_to: string;
  chain_id: string;
  block_height: number;
  address_from: string;
  address_to: string;
  params: string;
  method: string;
  block_hash: string;
  tx_fee: string;
  resources: string;
  quantity: number;
  tx_status: string;
  time: string;
}>;
