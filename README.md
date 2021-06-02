# Extrahorizon Javascript SDK

## Features

- [Auth][auth]: Provides authentication functionality. The Authentication service supports both OAuth 1.0a and OAuth 2.0 standards.
- [Users][users]: The user service stands in for managing users themselves, as well as roles related to users and groups of users.
- [Data][data]: A flexible data storage for structured data. Additionally, the service enables you to configure a state machine for instances of the structured data. You can couple actions that need to be triggered by the state machine, when/as the entities (instance of structured data) change their state. Thanks to these actions you can define automation rules (see later for more in depth description). These actions also make it possible to interact with other services.
- [Files][files]: A service that handles file storage, metadata & file retrieval based on tokens.
- [Tasks][tasks]: Start functions on demand, directly or at a future moment.
- [Templates][templates]: The template service manages templates used to build emails. It can be used to retrieve, create, update or delete templates as well as resolving them.
- [Mails][mails]: Provides mail functionality for other services.
- [Configurations][configurations]: Provides storage for custom configuration objects. On different levels (general, groups, users, links between groups and users).
- [Dispatchers][dispatchers]: Configure actions that need to be invoked when a specific event is/was triggered.

## Getting started

To get started with the Contentful Management JS SDK you'll need to install it, and then get credentials which will allow you to access your content in Contentful.

- [Installation](#Installation)
- [Authentication](#authentication)
- [Your first request](#your-first-request)
- [RQLBuilder](#RQLBuilder)
- [Interceptors](#interceptors)
- [Raw queries](#Raw-queries)
- [Logging](#logging)
- [TypeScript for your schemas](#typescript-for-your-schemas)

## Installation

Using npm:

```sh
npm install @extrahorizon/javascript-sdk
```

Using yarn:

```sh
yarn add @extrahorizon/javascript-sdk
```

## Authentication

<details>
    <summary>OAuth1 Token authentication</summary>

```js
import { createClient } from '@extrahorizon/javascript-sdk';

const sdk = createClient({
  host: 'dev.fibricheck.com',
  consumerKey: '',
  consumerSecret: '',
});

await sdk.auth.authenticate({
  token: '',
  tokenSecret: '',
});
```

</details>

<details>
    <summary>OAuth1 Email authentication</summary>

```js
import { createClient } from '@extrahorizon/javascript-sdk';

const sdk = createClient({
  host: 'dev.fibricheck.com',
  consumerKey: '',
  consumerSecret: '',
});

await sdk.auth.authenticate({
  email: '',
  password: '',
});
```

</details>

<details>
    <summary>OAuth2 Password Grant flow</summary>

```js
import { createClient } from '@extrahorizon/javascript-sdk';

const sdk = createClient({
  host: '',
  clientId: '',
});

await sdk.auth.authenticate({
  password: '',
  username: '',
});
```

</details>

<details>
    <summary>OAuth2 Authorization Code Grant flow with callback</summary>

```js
import { createClient } from '@extrahorizon/javascript-sdk';

const sdk = createClient({
  host: '',
  clientId: '',
  freshTokensCallback: tokenData => {
    localStorage.setItem('tokenData', tokenData);
  },
});

await sdk.auth.authenticate({
  code: '',
  redirectUri: '',
});
```

</details>

<details>
    <summary>OAuth2 Refresh Token Grant flow</summary>

```js
import { createClient } from '@extrahorizon/javascript-sdk';

const sdk = createClient({
  host: '',
  clientId: '',
});

await sdk.auth.authenticate({
  refreshToken: '',
});
```

</details>

<details>
    <summary>OAuth2 password grant flow with two-step MFA in try / catch</summary>

```js
import { createClient, MfaRequiredError } from '@extrahorizon/javascript-sdk';

const sdk = createClient({
  host: '',
  clientId: '',
});

try {
  await sdk.auth.authenticate({
    password: '',
    username: '',
  });
} catch (error) {
  if (error instanceof MfaRequiredError) {
    const { mfa } = error.response;

    // Your logic to request which method the user want to use in case of multiple methods
    const methodId = mfa.methods[0].id;

    await sdk.auth.confirmMfa({
      token: mfa.token,
      methodId,
      code: '', // code from ie. Google Authenticator
    });
  }
}
```

</details>

<br>

### Your first request

With es6 imports

```js
import { createClient } from '@extrahorizon/javascript-sdk';

(async () => {
  const sdk = createClient({
    host: '',
    clientId: '',
  });

  await sdk.auth.authenticate({
    password: '',
    username: '',
  });

  console.log('sdk.users.health()', await sdk.users.health());
  console.log('sdk.users.me()', await sdk.users.me());
})();
```

## RQLBuilder

The Extrahorizon Javascript SDK also export an rqlBuilder to build valid RQL strings. For more info see: https://developers.extrahorizon.io/guide/rql.html

```ts
import { rqlBuilder } from '@extrahorizon/javascript-sdk';

const rql = rqlBuilder().select('name').eq('name', 'fitbit').build();
// ?select(name)&eq(name,fitbit)
```

## Interceptors

The data returned from the backend is mapped using interceptors:

- Timestamps will be of type Date
- Keys in objects will be camelCased
- `records_affected` will be replaced by `affected_records`

## Raw queries

You can use the underlying Axios instance (after authentication) to call endpoints not yet wrapped by this SDK. Please note that the response does pass through the interceptors:

```ts
import { createClient } from '@extrahorizon/javascript-sdk';

(async () => {
  const sdk = createClient({
    host: '',
    clientId: '',
  });

  await sdk.auth.authenticate({
    password: '',
    username: '',
  });

  const me = await sdk.raw.get('/users/v1/me').data;
  console.log('Me', me);
})();
```

## Logging

You can pass in two logger function that will be called by Axios on every request/response respectively.

```ts
import AxiosLogger from "axios-logger";

const sdk = createClient({
  host: "https://api.dev.fibricheck.com",
  clientId: '',
  requestLogger: AxiosLogger.requestLogger,
  responseLogger: AxiosLogger.responseLogger,
});

await sdk.auth.authenticate({
  refreshToken: 'refreshToken'
})

await sdk.users.health();

[Axios][Request] POST /auth/v2/oauth2/token {"grant_type":"refresh_token","refresh_token":"refreshToken"}
[Axios][Response] POST /auth/v2/oauth2/token 200:OK {"access_token":"accessToken","token_type":"bearer","expires_in":299.999,"refresh_token":"refreshToken","user_id":"userId","application_id":"applicationId"}

[Axios][Request] GET /auth/v2/health
[Axios][Response] GET /auth/v2/health 200:OK

```

## Typescript for your Schemas

If you know the type info of your schemas, you can pass in the Typescript info when initializing the client. You will need to import the `Schema` and extend it with different JSONSchema types that are exported by the SDK.

As example the typing of the first schema in the example value from the get schema: https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/data-service/1.0.9/openapi.yaml#/Schemas/get_

```ts
import type { DataServicesTypes: { Schema,
  DocumentBase,
  JSONSchemaObject,
  JSONSchemaArray,
  JSONSchemaNumber } }  from "@extrahorizon/javascript-sdk";

interface MySchema extends Schema {
  statuses?: Record<'start', never>;
  properties?: {
    ppg: JSONSchemaArray & {
      maxItems: 2000;
      items: JSONSchemaNumber & { maximum: 255 }[];
    };
    location: JSONSchemaObject & {
      properties: {
        longitutde: JSONSchemaNumber & { minium: -180; maximum: 180 };
        latitude: JSONSchemaNumber & { minium: -90; maximum: 90 };
      };
    };
  };
}

const sdk = createClient({
  host: 'dev.fibricheck.com',
});

const { data: schemas } = await sdk.data.find();
const mySchema: CustomSchema = schemas[0];

interface CustomDocument extends DocumentBase {
  data: {
    ppg: Number[];
    location: {
      longitude: Number;
      latitude: Number;
    };
  };
}
const document = await sdk.data.findDocuments<CustomDocument>();
```

## Tests

To run the unit tests: `yarn start`

To run them in watch mode: `yarn start:watch`

To run e2e tests, copy `.env.example` to `.env` and set up the credentials

Then in `jest.config.js` comment line '/tests/e2e/' and run `yarn test:e2e`

## 📚 Docs --> TODO

- [docs](https://extraHorizon.github.io/javascript-sdk/)

## 📝 Changelog

You can check the changelog on the [releases](https://github.com/ExtraHorizon/javascript-sdk/releases) page.

## 🔑 License

The MIT License (MIT). Please see [License File](/LICENSE) for more information.

[auth]: https://developers.extrahorizon.io/services/auth-service/2.0.4-dev/
[users]: https://developers.extrahorizon.io/services/users-service/1.1.7/
[data]: https://developers.extrahorizon.io/services/data-service/1.0.9/
[files]: https://developers.extrahorizon.io/services/files-service/1.0.1-dev/
[tasks]: https://developers.extrahorizon.io/services/tasks-service/1.0.4/
[templates]: https://developers.extrahorizon.io/services/templates-service/1.0.13/
[mails]: https://developers.extrahorizon.io/services/mail-service/1.0.8-dev/
[configurations]: https://developers.extrahorizon.io/services/configurations-service/2.0.2-dev/
[dispatchers]: https://developers.extrahorizon.io/services/dispatchers-service/1.0.3-dev/
