# Quick start

Please see [authentication examples](../v7/setup/broken-reference/) for more options.

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

  console.log("exh.users.me()", await exh.users.me());
})();
```
