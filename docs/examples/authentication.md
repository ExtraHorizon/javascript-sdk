## Snippet for authentication flow in Browser

Each time the SDK refreshes the `accessToken` the `freshTokensCallback` is called with the response. You can store this data in `localStorage` or any other persistant data store. When you restart your application, you can check the data store for a `refreshToken` and use that to authenticate with the SDK.

```js
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const sdk = createOAuth2Client({
  host: '',
  clientId: '',
  freshTokensCallback: tokenData => {
    localStorage.setItem('refreshToken', tokenData.refreshToken);
  },
});

try {
  const refreshToken = await localStorage.getItem('refreshToken');

  if (refreshToken) {
    await sdk.auth.authenticate({
      refreshToken,
    });
  } else {
    // redirect to /login
  }
} catch (error) {
  localStorage.removeItem('refreshToken');
  // redirect to /login
}
```

## OAuth1

### Token authentication

```js
import { createOAuth1Client } from '@extrahorizon/javascript-sdk';

const sdk = createOAuth1Client({
  host: 'dev.fibricheck.com',
  consumerKey: '',
  consumerSecret: '',
});

await sdk.auth.authenticate({
  token: '',
  tokenSecret: '',
});
```

### Email authentication

```js
import { createOAuth1Client } from '@extrahorizon/javascript-sdk';

const sdk = createOAuth1Client({
  host: 'dev.fibricheck.com',
  consumerKey: '',
  consumerSecret: '',
});

await sdk.auth.authenticate({
  email: '',
  password: '',
});
```

## OAuth2

### Password Grant flow

```js
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const sdk = createOAuth2Client({
  host: '',
  clientId: '',
});

await sdk.auth.authenticate({
  password: '',
  username: '',
});
```

### Authorization Code Grant flow with callback

```js
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const sdk = createOAuth2Client({
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

### Refresh Token Grant flow

```js
import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

const sdk = createOAuth2Client({
  host: '',
  clientId: '',
});

await sdk.auth.authenticate({
  refreshToken: '',
});
```

### Password Grant flow with two-step MFA in try / catch

```js
import {
  createOAuth2Client,
  MfaRequiredError,
} from '@extrahorizon/javascript-sdk';

const sdk = createOAuth2Client({
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

![Refresh](../assets/refresh.webp)
