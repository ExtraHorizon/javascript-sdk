import nock from 'nock';
import {AUTH_BASE, DATA_BASE} from '../../../src/constants';
import {createOAuth2Client, OAuth2Client} from '../../../src/index';

describe('Infrastructure Service', () => {
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

  it('should get health', async () => {
    nock(`${host}${DATA_BASE}`).get('/health').reply(200);
    const health = await sdk.data.health();
    expect(health).toBe(true);
  });

  it('should retry on specific conditions and succeed', async () => {
    expect.assertions(1);
    const mockToken = 'test';
    nock(`${host}${DATA_BASE}`)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    const serviceClientException = {
      code: 7,
      name: 'SERVICE_CLIENT_EXCEPTION',
      message: 'Error while locating the service',
    };
    nock(`${host}${DATA_BASE}`)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(200, { all: 'good' });

    try {
      const result = await sdk.data.health();
      expect(result).toEqual({ all: 'good' });
      // eslint-disable-next-line no-empty
    } catch {}
  });

  it('should retry on specific conditions and fail', async () => {
    expect.assertions(1);
    const mockToken = 'health';
    nock(`${host}${DATA_BASE}`)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    const serviceClientException = {
      code: 7,
      name: 'SERVICE_CLIENT_EXCEPTION',
      message: 'Error while locating the service',
    };
    nock(`${host}${DATA_BASE}`)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(500, serviceClientException)
      .get('/health')
      .reply(200, { all: 'good' });

    try {
      await sdk.data.health();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
