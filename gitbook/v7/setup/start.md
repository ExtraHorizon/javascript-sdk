# Quick start

Please see [authentication examples](broken-reference/) for more options.

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

  console.log("exh.users.health()", await exh.users.health());
  console.log("exh.users.me()", await exh.users.me());
})();
```
