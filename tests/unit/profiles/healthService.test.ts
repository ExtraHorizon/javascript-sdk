import nock from 'nock';
import { AUTH_BASE, PROFILES_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';

describe('Health Service', () => {
  const host = 'https://api.xxx.fibricheck.com';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should perform a health check', async () => {
    nock(`${host}${PROFILES_BASE}`).get('/health').reply(200);

    const serviceIsAvailable = await sdk.profiles.health();

    expect(serviceIsAvailable).toBe(true);
  });
});
