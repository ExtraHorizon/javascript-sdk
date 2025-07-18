import nock from 'nock';
import {AUTH_BASE, CONFIGURATION_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client, rqlBuilder,} from '../../../src/index';
import {customGeneralConfigResponse, generalConfig, generalConfigResponse,} from '../../__helpers__/configuration';

describe('Configuration: General Service', () => {
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

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should get the general configuration', async () => {
    nock(`${host}${CONFIGURATION_BASE}`)
      .get('/general')
      .reply(200, generalConfigResponse);

    const res = await sdk.configurations.general.get();

    expect(res.userConfiguration).toBeDefined();
    expect(res.groupConfiguration).toBeDefined();
    expect(res.staffConfiguration).toBeDefined();
    expect(res.patientConfiguration).toBeDefined();
  });

  it('Should not transform custom data in the get response', async () => {
    // const customResponseKeys = ['data', 'userConfiguration', 'groupConfiguration', 'staffConfiguration', 'patientConfiguration'];
    nock(`${host}${CONFIGURATION_BASE}`)
      .get('/general')
      .reply(200, customGeneralConfigResponse);

    const response = await sdk.configurations.general.get();
    expect(response).toStrictEqual({
      ...customGeneralConfigResponse,
      creationTimestamp: new Date(
        customGeneralConfigResponse.creationTimestamp
      ),
      updateTimestamp: new Date(customGeneralConfigResponse.updateTimestamp),
    });
  });

  it('should update the general configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${CONFIGURATION_BASE}`).put('/general').reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.configurations.general.update(generalConfig, {
      rql,
    });

    expect(res.affectedRecords).toBe(1);
  });

  it('should delete fields from the general configuration', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${CONFIGURATION_BASE}`)
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
