import nock from 'nock';
import { randomHexString } from '../../__helpers__/utils';
import { createClient } from '../../../src';
import {
  AUTH_BASE,
  CONFIGURATION_BASE,
  USER_BASE,
} from '../../../src/constants';
import { authenticationResponse } from '../../__helpers__/auth';
import { newUserData, registerUserResponse } from '../../__helpers__/user';
import {
  customGeneralConfigResponse,
  generalConfigResponse,
} from '../../__helpers__/configuration';
import { createHttpClient } from '../../../src/http';
import { validateConfig } from '../../../src/utils';

describe('HttpClient', () => {
  let exh;
  const host = 'https://api.xxx.extrahorizon.com';
  const consumerKey = randomHexString(24);
  const consumerSecret = randomHexString(24);
  const clientId = randomHexString(24);

  beforeEach(() => {
    exh = createClient({
      host,
      consumerKey,
      consumerSecret,
    });
  });

  it('should create an http client', async () => {
    const http = createHttpClient({
      ...validateConfig({ host, clientId }),
      packageVersion: '',
    });
    expect(http).toBeDefined();
  });

  it('should create an http client and makes a GET request', async () => {
    nock(host).get('/test').reply(200, '');

    const http = createHttpClient({
      ...validateConfig({ host, clientId }),
      packageVersion: '',
      requestLogger: value => value,
      responseLogger: value => value,
    });

    const test = await http.get('test');

    expect(test.data).toBe('');
  });

  it('Should transform dates in the response when authenticating a user', async () => {
    nock(`${host}${AUTH_BASE}`)
      .post('/oauth1/tokens')
      .reply(200, authenticationResponse);

    const response = await exh.auth.authenticate({
      email: 'string',
      password: 'string',
    });

    expect(response).toStrictEqual({
      ...authenticationResponse,
      creationTimestamp: new Date(authenticationResponse.creationTimestamp),
      updateTimestamp: new Date(authenticationResponse.updateTimestamp),
    });
  });

  it('Should transform dates in the response when creating an account', async () => {
    nock(`${host}${USER_BASE}`)
      .post('/register')
      .reply(200, registerUserResponse);

    const response = await exh.users.createAccount(newUserData);
    expect(response).toStrictEqual({
      id: registerUserResponse.id,
      ...newUserData,
      creationTimestamp: new Date(registerUserResponse.creation_timestamp),
      updateTimestamp: new Date(registerUserResponse.update_timestamp),
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
