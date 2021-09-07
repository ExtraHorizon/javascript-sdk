## RQL Builder

The Extrahorizon Javascript SDK also export an rqlBuilder to build valid RQL strings. For more info see: https://developers.extrahorizon.io/guide/rql.html

```js
import { rqlBuilder } from '@extrahorizon/javascript-sdk';

const rql = rqlBuilder().select('name').eq('name', 'fitbit').build();
// ?select(name)&eq(name,fitbit)
```

An example using the rqlBuilder to compose a complex rql request documents having a heartRate between 40 and 50 or indicator = 'warning'

```js
import { rqlBuilder } from '@extrahorizon/javascript-sdk';

const rql = rqlBuilder()
  .or(
    rqlBuilder()
      .and(
        rqlBuilder().lt('data.heartRate', '50').intermediate(),
        rqlBuilder().gt('data.heartRate', '40').intermediate()
      )
      .intermediate(),
    rqlBuilder().eq('data.indicator', 'warning').intermediate()
  )
  .select(['id', 'name', 'data.heartRate', 'data.indicator'])
  .build();

// ?or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)
const result = await sdk.data.documents.find({ rql });
```

You can also compose this yourself stringbased.

```js
import { rqlBuilder } from '@extrahorizon/javascript-sdk';

const rql = rqlBuilder(
  'or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)'
).build();

// ?or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)
const result = await sdk.data.documents.find({ rql });
```

## Raw Queries

You can use the underlying Axios instance (after authentication) to call endpoints not yet wrapped by this SDK. Please note that the response does pass through the interceptors:

```js
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

(async () => {
  const sdk = createOAuth2Client({
    host: '',
    clientId: '',
  });

  await sdk.auth.authenticate({
    password: '',
    username: '',
  });

  const me = (await sdk.raw.get('/users/v1/me')).data;
  console.log('Me', me);
})();
```

## Logging

You can pass in two logger function that will be called by Axios on every request/response respectively.

```js
import AxiosLogger from "axios-logger";

const sdk = createOAuth2Client({
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

## Schema/Document Generics

If you know the type info of your schemas, you can pass in the Typescript info when initializing the client. You will need to import the `Schema` and extend it with different JSONSchema types that are exported by the SDK.

As example the typing of the first schema in the example value from the get schema: https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/data-service/1.0.9/openapi.yaml#/Schemas/get_

```ts
import {
  createOAuth2Client,
  Schema,
  JSONSchemaObject,
  JSONSchemaArray,
  JSONSchemaNumber,
} from '@extrahorizon/javascript-sdk';

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

const sdk = createOAuth2Client({
  host: 'dev.fibricheck.com',
  clientId: '',
});

const { data: schemas } = await sdk.data.schemas.find();
const mySchema: MySchema = schemas[0];

interface MyData {
  ppg: Number[];
  location: {
    longitude: Number;
    latitude: Number;
  };
}
const document = await sdk.data.documents.find<MyData>(mySchema.id);
```

## SSL Pinning

If you are using the SDK in a React Native application, you can use these hashes to enable SSL pinning in your application.

Android

```
"sha256/++MBgDH5WGvL9Bcn5Be30cRcL0f5O+NyoXuWtQdX1aI="
"sha256/f0KW/FtqTjs108NpYj42SrGvOB2PpxIVM8nWxjPqJGE="
"sha256/NqvDJlas/GRcYbcWE8S/IceH9cq77kg0jVhZeAPXq8k="
"sha256/9+ze1cZgR9KO1kZrVDxA4HQ6voHRCSVNz4RdTCx4U8U="
```

Ios

```
@"++MBgDH5WGvL9Bcn5Be30cRcL0f5O+NyoXuWtQdX1aI="
@"f0KW/FtqTjs108NpYj42SrGvOB2PpxIVM8nWxjPqJGE="
@"NqvDJlas/GRcYbcWE8S/IceH9cq77kg0jVhZeAPXq8k="
@"9+ze1cZgR9KO1kZrVDxA4HQ6voHRCSVNz4RdTCx4U8U="
```

More info on how to use the can be found here: https://medium.com/@jaedmuva/react-native-ssl-pinning-is-back-e317e6682642

## Tests

### Mock

The package also exports a mockSdk you can use in your tests. In this example `jest` is used as testing library.

```ts
import { getMockSdk } from '@extrahorizon/javascript-sdk';

describe('mock SDK', () => {
  const sdk = getMockSdk<jest.Mock>(jest.fn);
  it('should be valid mock', async () => {
    expect(sdk.data).toBeDefined();
  });
});
```

If you are using `jest`. You can create a file under your `__mocks__/@extrahorizon/` called `javascript-sdk.ts` and add the following content:

```ts
import { getMockSdk } from '@extrahorizon/javascript-sdk';

export const mockSdk = getMockSdk<jest.Mock>(jest.fn);

const createOAuth1Client = () => mockSdk;

module.exports = {
  ...jest.requireActual('@extrahorizon/javascript-sdk'),
  createOAuth1Client,
  mockSdk,
};
```

### Library

To run the unit tests: `yarn start`
To run them in watch mode: `yarn start:watch`
To run e2e tests, copy `.env.example` to `.env` and set up the credentials
Then in `jest.config.js` comment line '/tests/e2e/' and run `yarn test:e2e`
