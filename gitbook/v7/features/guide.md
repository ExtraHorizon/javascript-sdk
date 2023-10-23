# Guide

## RQL

RQL, or Resource Query Language, is a query language used for querying and manipulating resources through the URI. RQL provides the ability to filter, sort, paginate, and project data. More info on the RQL capabilities of the Extra Horizon platform can be found [here](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql).

### Builder

The Extrahorizon Javascript SDK also export an `rqlBuilder` to build valid RQL strings.

```ts
import { rqlBuilder } from "@extrahorizon/javascript-sdk";

const rql = rqlBuilder().select("name").eq("name", "fitbit").build();
// ?select(name)&eq(name,fitbit)
```

An example using the `rqlBuilder` to compose a complex RQL query to request documents having a `heartRate` between 40 and 50 or where the `indicator` field has the value `warning`.

```ts
import { rqlBuilder } from "@extrahorizon/javascript-sdk";

const rql = rqlBuilder()
  .or(
    rqlBuilder()
      .and(
        rqlBuilder().lt("data.heartRate", "50").intermediate(),
        rqlBuilder().gt("data.heartRate", "40").intermediate()
      )
      .intermediate(),
    rqlBuilder().eq("data.indicator", "warning").intermediate()
  )
  .select(["id", "name", "data.heartRate", "data.indicator"])
  .build();

// ?or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)
const result = await exh.data.documents.find({ rql });
```

### Parser

You can also use the `rqlParser` function and pass in your own stirng.

```ts
import { rqlParser } from "@extrahorizon/javascript-sdk";

const rql = rqlParser(
  "or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)"
);

// ?or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)
const result = await exh.data.documents.find({ rql });
```

## Raw Queries

You can use the underlying Axios instance (after authentication) to call endpoints not yet wrapped by this SDK. Please note that the response does pass through the interceptors:

```ts
import { createOAuth2Client } from "@extrahorizon/javascript-sdk";

(async () => {
  const exh = createOAuth2Client({
    host: "",
    clientId: "",
  });

  await exh.auth.authenticate({
    password: "",
    username: "",
  });

  const me = (await exh.raw.get("/users/v1/me")).data;
  console.log("Me", me);
})();
```

## Logging

You can pass in two logger function that will be called by Axios on every request/response respectively.

```ts
import AxiosLogger from "axios-logger";

const exh = createOAuth2Client({
  host: "https://api.dev.exh-sandbox.extrahorizon.io",
  clientId: '',
  requestLogger: AxiosLogger.requestLogger,
  responseLogger: AxiosLogger.responseLogger,
});

await exh.auth.authenticate({
  refreshToken: 'refreshToken'
})

await exh.users.health();

[Axios][Request] POST /auth/v2/oauth2/token {"grant_type":"refresh_token","refresh_token":"refreshToken"}
[Axios][Response] POST /auth/v2/oauth2/token 200:OK {"access_token":"accessToken","token_type":"bearer","expires_in":299.999,"refresh_token":"refreshToken","user_id":"userId","application_id":"applicationId"}

[Axios][Request] GET /auth/v2/health
[Axios][Response] GET /auth/v2/health 200:OK

```

## Schema/Document Generics

If you know the type info of your schemas, you can pass in the Typescript info when initializing the client. You will need to import the `Schema` and extend it with different JSONSchema types that are exported by the SDK.

As example the typing of the first schema in the example value from the get schema: https://developers.extrahorizon.io/swagger-ui/?url=https://developers.extrahorizon.io/services/data-service/1.0.9/openapi.yaml#/Schemas/get\_

```ts
import {
  createOAuth2Client,
  Schema,
  JSONSchemaObject,
  JSONSchemaArray,
  JSONSchemaNumber,
} from "@extrahorizon/javascript-sdk";

interface MySchema extends Schema {
  statuses?: Record<"start", never>;
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

const exh = createOAuth2Client({
  host: "https://api.dev.exh-sandbox.extrahorizon.io",
  clientId: "",
});

const { data: schemas } = await exh.data.schemas.find();
const mySchema: MySchema = schemas[0];

interface MyData {
  ppg: Number[];
  location: {
    longitude: Number;
    latitude: Number;
  };
}
const document = await exh.data.documents.find<MyData>(mySchema.id);
```

## Tests

### Mock

The package also exports a mockSdk you can use in your tests. In this example `jest` is used as testing library.

```ts
import { getMockSdk } from "@extrahorizon/javascript-sdk";

describe("mock SDK", () => {
  const exh = getMockSdk<jest.Mock>(jest.fn);
  it("should be valid mock", async () => {
    expect(exh.data).toBeDefined();
  });
});
```

If you are using `jest`. You can create a file under your `__mocks__/@extrahorizon/` called `javascript-sdk.ts` and add the following content:

```ts
import { getMockSdk } from "@extrahorizon/javascript-sdk";

export const exh = getMockSdk<jest.Mock>(jest.fn);

const createOAuth1Client = () => exh;

module.exports = {
  ...jest.requireActual("@extrahorizon/javascript-sdk"),
  createOAuth1Client,
  exh,
};
```

## Library

To run the unit tests: `yarn start` To run them in watch mode: `yarn start:watch` To run e2e tests, copy `.env.example` to `.env` and set up the credentials Then in `jest.config.js` comment line '/tests/e2e/' and run `yarn test:e2e`
