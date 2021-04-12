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

  it('health()', async () => {
    const res = await sdk.users.health();
    expect(res).toBe(true);
  });

  it('me()', async () => {
    const user = await sdk.users.me();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBeDefined();
  });

  it('find()', async () => {
    const res = await sdk.users.find('?select(id)');
    expect(res).toBeDefined();
  });
});
