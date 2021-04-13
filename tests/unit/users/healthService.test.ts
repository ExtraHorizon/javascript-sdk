import * as nock from 'nock';
import { client } from '../../../src/index';

describe('Health Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  let sdk;

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
      .post('/auth/v2/oauth2/token')
      .reply(200, { access_token: mockToken });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Can get health', async () => {
    nock(`${apiHost}/users/v1`).get('/health').reply(200, '');
    const health = await sdk.users.health();
    expect(health).toBe(true);
  });
});
