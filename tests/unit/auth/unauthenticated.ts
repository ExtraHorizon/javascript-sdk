// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { randomHexString } from '../../__helpers__/utils';
import { createClient } from '../../../src';
import { authenticationResponse } from '../../__helpers__/auth';
import { AUTH_BASE, CONFIGURATION_BASE } from '../../../src/constants';
import {
  customGeneralConfigResponse,
  generalConfigResponse,
} from '../../__helpers__/configuration';

describe('Auth - Unauthenticated', () => {
  let exh;
  const host = 'https://api.xxx.extrahorizon.com';
  const consumerKey = randomHexString(24);
  const consumerSecret = randomHexString(24);

  beforeEach(() => {
    exh = createClient({
      host,
      consumerKey,
      consumerSecret,
    });
  });

  it('Should transform dates in the response of an unauthenticated request', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post('/oauth1/tokens')
      .reply(200, authenticationResponse);

    const response = await exh.auth.authenticate({
      email: 'string',
      password: 'string',
    });

    expect(response).toStrictEqual({
      id: expect.any(String),
      applicationId: expect.any(String),
      userId: expect.any(String),
      token: expect.any(String),
      tokenSecret: expect.any(String),
      key: expect.any(String),
      secret: expect.any(String),
      creationTimestamp: expect.any(Date),
      updateTimestamp: expect.any(Date),
    });
  });

  it('Should not transform custom data in get responses', async () => {
    // const customResponseKeys = ['data', 'userConfiguration', 'groupConfiguration', 'staffConfiguration', 'patientConfiguration'];
    nock(`${host}${CONFIGURATION_BASE}`)
      .get('/general')
      .reply(200, customGeneralConfigResponse);

    const response = await exh.configurations.general.get();
    expect(response).toStrictEqual({
      ...customGeneralConfigResponse,
      creationTimestamp: new Date(
        customGeneralConfigResponse.creationTimestamp
      ),
      updateTimestamp: new Date(customGeneralConfigResponse.updateTimestamp),
    });
  });

  it('Should transform custom data if normalizeCustomData is true on the request', async () => {
    // const customResponseKeys = ['data', 'userConfiguration', 'groupConfiguration', 'staffConfiguration', 'patientConfiguration'];
    nock(`${host}${CONFIGURATION_BASE}`)
      .get('/general')
      .reply(200, customGeneralConfigResponse);

    const response = await exh.configurations.general.get({
      normalizeCustomData: true,
    });
    expect(response).toStrictEqual({
      ...generalConfigResponse,
      id: customGeneralConfigResponse.id,
      creationTimestamp: new Date(
        customGeneralConfigResponse.creationTimestamp
      ),
      updateTimestamp: new Date(customGeneralConfigResponse.updateTimestamp),
    });
  });
});
