import nock from 'nock';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import {
  generalConfig,
  generalConfigResponse,
} from '../../__helpers__/configuration';

describe('Configuration: General Service', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
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

  it('should get the general configuration', async () => {
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .get('/general')
      .reply(200, generalConfigResponse);

    const res = await sdk.configurations.general.get();

    expect(res.userConfiguration).toBeDefined();
    expect(res.groupConfiguration).toBeDefined();
    expect(res.staffConfiguration).toBeDefined();
    expect(res.patientConfiguration).toBeDefined();
  });

  it('should update the general configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${CONFIGURATION_BASE}`).put('/general').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.configurations.general.update(generalConfig, {
      rql,
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from the general configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${apiHost}${CONFIGURATION_BASE}`)
      .post('/general/deleteFields')
      .reply(200, {
        affectedRecords: 1,
      });

    const res = await sdk.configurations.general.removeFields(
      {
        fields: ['data.enableEpicFeature'],
      },
      {
        rql,
      }
    );

    expect(res.affectedRecords).toBe(1);
  });
});
