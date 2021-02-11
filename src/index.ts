import fetch from 'node-fetch';

export class LndRestClient {
  static macaroonHeaderKey = 'grpc-metadata-macaroon';

  constructor(private readonly baseUrl: string, private readonly macaroons: Macaroons) {
    if (typeof window !== 'undefined') {
      throw new Error(
        "Please don't use this library in the client. Your macaroons will be exposed."
      );
    }
  }

  async createChannelsTransaction(body: {
    payment_request: string;
  }): Promise<CreateChannelsTransactionResponse> {
    const response = await fetch(`${this.baseUrl}/v1/channels/transactions`, {
      body: JSON.stringify(body),
      headers: { [LndRestClient.macaroonHeaderKey]: this.macaroons.admin },
      method: 'POST',
    });
    const data = await response.json();
    return { ...data, _type: data.error ? 'error' : 'success' };
  }

  async createOnChainTransaction(body: {
    addr: string;
    amount: string | number;
  }): Promise<{ _type: 'success'; txid: string } | Error> {
    const response = await fetch(`${this.baseUrl}/v1/transactions`, {
      body: JSON.stringify(body),
      headers: { [LndRestClient.macaroonHeaderKey]: this.macaroons.admin },
      method: 'POST',
    });
    const data = await response.json();
    return { ...data, _type: data.error ? 'error' : 'success' };
  }

  async getGraphNode(pubKey: string): Promise<GetGraphNodeResponse> {
    const response = await fetch(`${this.baseUrl}/v1/graph/node/${pubKey}`, {
      headers: { [LndRestClient.macaroonHeaderKey]: this.macaroons.readonly },
    });
    const data = await response.json();
    return { ...data, _type: data.error ? 'error' : 'success' };
  }

  async getPaymentRequest(paymentRequest: string): Promise<GetPaymentRequestResponse> {
    const response = await fetch(`${this.baseUrl}/v1/payreq/${paymentRequest}`, {
      headers: { [LndRestClient.macaroonHeaderKey]: this.macaroons.readonly },
    });
    const data = await response.json();
    return { ...data, _type: data.error ? 'error' : 'success' };
  }
}

type Error = { _type: 'error'; error: string; message: string; code: number; details: string[] };

type CreateChannelsTransactionResponse =
  | {
      _type: 'success';
      payment_error: string;
      payment_preimage: string;
      payment_route: Route;
      payment_hash: string;
    }
  | Error;
type GetGraphNodeResponse =
  | {
      _type: 'success';
      node: LightningNode;
      num_channels: number;
      total_capacity: string;
      channels: ChannelEdge[];
    }
  | Error;

type GetPaymentRequestResponse =
  | {
      _type: 'success';
      destination: string;
      payment_hash: string;
      num_satoshis: string;
      timestamp: string;
      expiry: string;
      description: string;
      description_hash: string;
      fallback_addr: string;
      cltv_expiry: string;
      route_hints: RouteHint[];
      payment_addr: string;
      num_msat: string;
      features: { [k: string]: { name: string; is_required: boolean; is_known: boolean } };
    }
  | Error;

type ChannelEdge = {
  channel_id: string;
  chan_point: string;
  last_update: number;
  node1_pub: string;
  node2_pub: string;
  capacity: string;
  node1_policy: RoutingPolicy;
  node2_policy: RoutingPolicy;
};

type Hop = {
  amt_to_forward: string;
  chan_id: string;
  chan_capacity: string;
  expiry: number;
  amt_to_forward_msat: string;
  fee_msat: string;
  pub_key?: string;
  tlv_payload: boolean;
  mpp_record?: MppRecord;
  custom_records: { [k: string]: string };
};

type HopHint = {
  node_id: string;
  chan_id: string;
  fee_base_msat: number;
  fee_proportional_millionths: number;
  citv_expiry_delta: number;
};

type LightningNode = {
  last_update: number;
  pub_key: string;
  alias: string;
  addresses: NodeAddress[];
  color: string;
  features: any;
};

type NodeAddress = { network: string; addr: string };

type Macaroons = {
  admin: string;
  invoice: string;
  readonly: string;
};

type MppRecord = {
  payment_addr: string;
  total_amt_msat: string;
};

type Route = {
  hops: Hop[];
  total_amt: string;
  total_amt_msat: string;
  total_fees: string;
  total_fees_msat: string;
  total_time_lock: number;
};

type RouteHint = {
  hop_hints: HopHint[];
};

type RoutingPolicy = {
  time_lock_delta: number;
  min_htlc: string;
  fee_base_msat: string;
  fee_rate_milli_msat: string;
  disabled: boolean;
  max_htlc_msat: string;
  last_update: number;
};
