# LND REST Client

[![npm](https://img.shields.io/npm/v/lnd-rest-client?style=plastic)](https://www.npmjs.com/package/lnd-rest-client)

This project will wrap the entire [LND REST API](https://api.lightning.community/#lnd-rest-api-reference) for use in NodeJS. It is currently under development and accepting contributions.

## Installation

```bash
npm install lnd-rest-client
```

or

```bash
yarn add lnd-rest-client
```

## Usage

```typescript
import { LndRestClient } from 'lnd-rest-client';

const lndRestClient = new LndRestClient(baseUrl, {
  admin: process.env.ADMIN_MACAROON,
  base: process.env.BASE_MACAROON,
  invoice: process.env.INVOICE_MACAROON,
  readonly: process.env.READ_ONLY_MACAROON,
});

const paymentRequestInfo = await lndRestClient.getPaymentRequest(paymentRequest);
```

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes.

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.

The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
