import nock from 'nock';
import { AUTH_BASE, LOCALIZATIONS_BASE } from '../../../src/constants';
import { Client, createClient, ParamsOauth2 } from '../../../src/index';
import {
  countriesResponse,
  regionsResponse,
} from '../../__helpers__/localization';

describe('Countries Service', () => {
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

  it('should retrieve a list of all the defined countries', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .get('/countries')
      .reply(200, countriesResponse);

    const res = await sdk.localizations.getCountries();

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of all the defined regions for the specified country code', async () => {
    const countryCode = 'BE';
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .get(`/countries/${countryCode}/regions`)
      .reply(200, regionsResponse);

    const res = await sdk.localizations.getRegions(countryCode);

    expect(res.data.length).toBeGreaterThan(0);
  });
});
