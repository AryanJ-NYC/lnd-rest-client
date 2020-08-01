/**
 * @jest-environment node
 */
import { LndRestClient } from '../src';

describe('LndRestClient', () => {
  let lndRestClient: LndRestClient;

  beforeEach(() => {
    const macaroons = {
      admin: 'adminMacaroon',
      base: 'baseMacaroon',
      invoice: 'invoiceMacaroon',
      readonly: 'readonlyMacaroon',
    };
    lndRestClient = new LndRestClient('https://lnd.com', macaroons);
  });

  test('successfully initializes', () => {
    expect(lndRestClient).toBeDefined();
  });
});
