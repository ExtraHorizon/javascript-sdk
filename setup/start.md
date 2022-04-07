# Quick start

Please see [authentication examples](broken-reference) for more options.

```ts
import { createOAuth2Client } from "@extrahorizon/javascript-sdk";

(async () => {
  const sdk = createOAuth2Client({
    host: "",
    clientId: "",
  });

  await sdk.auth.authenticate({
    password: "",
    username: "",
  });

  console.log("sdk.users.health()", await sdk.users.health());
  console.log("sdk.users.me()", await sdk.users.me());
})();
```
