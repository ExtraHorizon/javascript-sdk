import nock from 'nock';
import { AUTH_BASE, LOCALIZATIONS_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  rqlBuilder,
  ParamsOauth2,
} from '../../../src/index';
import {
  localizationData,
  localizationCreatedResponse,
  localizationUpdatedResponse,
  localizationInput,
  localizationRequest,
} from '../../__helpers__/localization';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Localizations Service', () => {
  const host = 'https://api.xxx.fibricheck.com';
  const localizationKey = localizationData.key;
  const localizationResponse = createPagedResponse(localizationData);

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

  it('should get all possible localizations stored in this service', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .get(`/${rql}`)
      .reply(200, localizationResponse);

    const res = await sdk.localizations.find({ rql });

    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should find a localization by key', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .get(`/?eq(key,${localizationKey})`)
      .reply(200, localizationResponse);

    const localization = await sdk.localizations.findByKey(localizationKey);

    expect(localization.key).toBe(localizationKey);
  });

  it('should find the first localization', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .get('/')
      .reply(200, localizationResponse);

    const localization = await sdk.localizations.findFirst();

    expect(localization).toEqual(localizationResponse.data[0]);
  });

  it('should create a new localization', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .post('/')
      .reply(200, localizationCreatedResponse);

    const res = await sdk.localizations.create({
      localizations: [localizationInput],
    });

    expect(res.created).toBe(localizationCreatedResponse.created);
  });

  it('should update an existing localization', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .put('/')
      .reply(200, localizationUpdatedResponse);

    const res = await sdk.localizations.update({
      localizations: [localizationInput],
    });

    expect(res.updated).toBe(localizationUpdatedResponse.updated);
  });

  it('should delete a localization', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .delete(`/${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.localizations.remove(rql);

    expect(res.affectedRecords).toBe(1);
  });

  it('should request localizations of multiple keys in a specific language', async () => {
    nock(`${host}${LOCALIZATIONS_BASE}`)
      .post('/request')
      .reply(200, {
        mail_subject: {
          NL: 'Je aankoop',
          EN: 'Your purchase',
        },
      });

    const res = await sdk.localizations.getByKeys(localizationRequest);

    expect(res).toBeTruthy();
  });
});
