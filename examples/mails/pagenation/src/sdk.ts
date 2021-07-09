import { createOAuth2Client } from '@extrahorizon/javascript-sdk';

export async function getSdk() {
  const sdk = createOAuth2Client({
    host: process.env.REACT_APP_HOST || '',
    clientId: process.env.REACT_APP_CLIENT_ID || '',
  });
  await sdk.auth.authenticate({
    username: process.env.REACT_APP_USERNAME || '',
    password: process.env.REACT_APP_PASSWORD || '',
  });

  return sdk;
}
