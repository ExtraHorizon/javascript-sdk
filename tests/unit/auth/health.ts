import nock from 'nock';
import {AUTH_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';

describe('Auth - Health', () => {
  const host = 'https://api.xxx.extrahorizon.io';

  let sdk: OAuth2Client;

  beforeAll(async () => {
    sdk = createOAuth2Client({
      host,
      clientId: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should get health', async () => {
    nock(`${host}${AUTH_BASE}`).get('/health').reply(200);

    const health = await sdk.auth.health();

    expect(health).toEqual(true);
  });
});
