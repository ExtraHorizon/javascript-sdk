import { client } from '../../src';

describe('OAuth2 Password Flow', () => {
  let sdk;

  beforeAll(() => {
    sdk = client({
      apiHost: process.env.API_HOST,
      oauth: {
        clientId: process.env.CLIENT_ID,
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
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
