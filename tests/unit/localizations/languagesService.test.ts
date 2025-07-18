import nock from 'nock';
import {AUTH_BASE, LOCALIZATIONS_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';
import {createPagedResponse} from '../../__helpers__/utils';

describe('Languages Service', () => {
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

  it('should retrieve a list of all the defined languages', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .get('/languages')
      .reply(200, createPagedResponse('NL'));

    const res = await sdk.localizations.getLanguages();

    expect(res.length).toBeGreaterThan(0);
  });
});
