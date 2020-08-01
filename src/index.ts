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
  }): Promise<{
    payment_error: string;
    payment_preimage: string;
    payment_route: Route;
    payment_hash: string;
  }> {
    const response = await fetch(`${this.baseUrl}/v1/channels/transactions`, {
      body: JSON.stringify(body),
      headers: { [LndRestClient.macaroonHeaderKey]: this.macaroons.admin },
      method: 'POST',
    });
    return response.json();
  }

  async getPaymentRequest(
    paymentRequest: string
  ): Promise<{
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
  }> {
    const response = await fetch(`${this.baseUrl}/v1/payreq/${paymentRequest}`, {
      headers: { [LndRestClient.macaroonHeaderKey]: this.macaroons.readonly },
    });
    return response.json();
  }
}

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

type Macaroons = {
  base: string;
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
