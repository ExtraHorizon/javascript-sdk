import nock from 'nock';
import {AUTH_BASE, EVENTS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';

describe('Events - Health Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';

  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
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

  it('should perform a health check', async () => {
    nock(`${host}${EVENTS_BASE}`).get('/health').reply(200);

    const serviceIsAvailable = await sdk.events.health();

    expect(serviceIsAvailable).toBe(true);
  });
});
