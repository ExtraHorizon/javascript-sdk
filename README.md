# Extrahorizon Javascript SDK

## 🧙 Installation

Using npm:

```sh
npm install @qompium/javascript-sdk
```

Using yarn:

```sh
yarn add @qompium/javascript-sdk
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

## 📚 Docs --> TODO

- [docs](https://extraHorizon.github.io/javascript-sdk/)

## 📝 Changelog

You can check the changelog on the [releases](https://github.com/craftzing/node-akeneo-api/releases) page.

## 🔑 License

The MIT License (MIT). Please see [License File](/LICENSE) for more information.
