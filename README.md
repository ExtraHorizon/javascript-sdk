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

- oAuth2 password grant flow with two-step MFA in try / catch

```js
import { client, MfaRequiredError } from '@extrahorizon/javascript-sdk';

const apiHost = 'https://api.dev.fibricheck.com';
const clientId = '263bfa9a1d1ced19e228c28eb2a331f774184243';
const password = 'Azerty123';
const username = 'jens.verbeken@craftzing.com';

const sdk = client({
  apiHost,
});

try {
  await sdk.authenticate({
    clientId,
    password,
    username,
  });
} catch (error) {
  if (error instanceof MfaRequiredError) {
    const { mfa } = error.response;

    // Your logic to request which method the user want to use in case of multiple methods
    const methodId = mfa.methods[0].id;

    await sdk.confirmMfa({
      token: mfa.token,
      methodId,
      code: '', // code from ie. Google Authenticator
    });
  }
}
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
