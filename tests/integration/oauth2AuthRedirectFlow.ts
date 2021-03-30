import { client } from '../../src';

describe('OAuth2 Auth Redirect Flow', () => {
  let sdk;

  beforeAll(() => {
    sdk = client({
      apiHost: process.env.API_HOST,
      oauth: {
        clientId: process.env.CLIENT_ID,
        code: process.env.CODE,
        redirectUri: process.env.REDIRECT_URI,
      },
    });
  });

  it('getHealth()', async () => {
    const res = await sdk.users.getHealth();
    expect(res).toBe(true);
  });

  it('getMe()', async () => {
    const user = await sdk.users.getMe();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBeDefined();
  });
});
