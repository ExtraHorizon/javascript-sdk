import * as nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import { Client, client } from '../../../src/index';

describe('Health Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk: Client;

  beforeAll(() => {
    sdk = client({
      apiHost,
      oauth: {
        clientId: '',
        username: '',
        password: '',
      },
    });

    const mockToken = 'mockToken';
    nock(apiHost)
      .post(`${AUTH_BASE}/oauth2/token`)
      .reply(200, { access_token: mockToken });
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
