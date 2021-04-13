# Extrahorizon Javascript SDK

## 🧙 Installation

Using npm:

```sh
npm install @extrahorizon/javascript-sdk
```

Using yarn:

```sh
yarn add @extrahorizon/javascript-sdk
```

## ⚙️ Configuration

### Authentication

- oAuth1 authentication

```js
import { client } from '@extrahorizon/javascript-sdk';

const sdk = client({
  apiHost: 'dev.fibricheck.com',
  oauth: {
    consumerKey: '',
    consumerSecret: '',
    tokenKey: '',
    tokenSecret: '',
  },
});
```

- oAuth2 password grant flow

```js
import { client } from '@extrahorizon/javascript-sdk';

const sdk = client({
  apiHost: '',
  oauth: {
    clientId: '',
    password: '',
    username: '',
  },
});
```

- oAuth2 authorization grant flow

```js
import { client } from '@extrahorizon/javascript-sdk';

const sdk = client({
  apiHost: '',
  oauth: {
    clientId: '',
    code: '',
    redirectUri: '',
  },
});
```

### Your first request

With es6 imports

```js
import { client } from '@extrahorizon/javascript-sdk';

const sdk = client(config);

(async () => {
  console.log('sdk.users.health()', await sdk.users.health());
  console.log('sdk.users.me()', await sdk.users.me());
})();
```

### Tests

To run the unit tests: `yarn start`

To run them in watch mode: `yarn start:watch`

To run e2e tests, copy `.env.example` to `.env` and set up the credentials

Then in `jest.config.js` comment line '/tests/e2e/' and run `yarn test:e2e`

### RQL builder

The Extrahorizon Javascript SDK also export an rqlBuilder to build valid RQL strings. For more info see: https://developers.extrahorizon.io/guide/rql.html

```ts
import { rqlBuilder } from '@extrahorizon/javascript-sdk';

const rql = rqlBuilder().select('name').eq('name', 'fitbit').build();
// ?select(name)&eq(name,fitbit)
```

## 📚 Docs --> TODO

- [docs](https://extraHorizon.github.io/javascript-sdk/)

## 📝 Changelog

You can check the changelog on the [releases](https://github.com/craftzing/node-akeneo-api/releases) page.

## 🔑 License

The MIT License (MIT). Please see [License File](/LICENSE) for more information.
