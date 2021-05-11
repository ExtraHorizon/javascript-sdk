import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import { Client, client, ParamsOauth2 } from '../../../src/index';

describe('Health Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(apiHost)
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

  it('Can get health', async () => {
    nock(`${apiHost}${USER_BASE}`).get('/health').reply(200, '');
    const health = await sdk.users.health();
    expect(health).toBe(true);
  });
});
