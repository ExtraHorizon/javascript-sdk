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

#### Automatic double encoding of values

{% hint style="success" %}
Available since v8.0.0
{% endhint %}

Each value passed to the operators of the `rqlBuilder` undergoes double encoding to enable the searching of special characters. More information on why values need to be double encoded can be found [here](https://docs.extrahorizon.com/extrahorizon/additional-resources/resource-query-language-rql#double-encoding-of-special-characters).

<details>

<summary>Disable automatic double encoding</summary>

We strongly advise against disabling automatic double encoding.\
\
To deactivate double encoding for all queries generated with the `rqlBuilder`, you add the following line to the start of your application:\
`rqlBuilder.doubleEncodeValues = false;`\
\
For disabling double encoding on a per-query basis, you can utilize the `options` parameter in the `rqlBuilder` constructor like this:\
`rqlBuilder({ doubleEncode: false })`

</details>

### Parser

You can also use the `rqlParser` function and pass in your own string.

```ts
import { rqlParser } from "@extrahorizon/javascript-sdk";

const rql = rqlParser(
  "or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)"
);

// ?or(and(lt(data.heartRate,50),gt(data.heartRate,40)),eq(data.indicator,warning))&select(id,name,data.heartRate,data.indicator)
const result = await exh.data.documents.find({ rql });
```

## Raw Requests

You can use the underlying Axios instance (after authentication) to call endpoints not yet wrapped by this SDK.

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
