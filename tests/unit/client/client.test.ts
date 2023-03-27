import nock from 'nock';
import { validateConfig } from '../../../src/utils';
import { createHttpClient } from '../../../src/http/client';

const mockParams = {
  host: 'https://api.test.com',
  clientId: 'clientId',
};

describe('HttpClient', () => {
  it('should create an http client', async () => {
    const http = createHttpClient({
      ...validateConfig(mockParams),
      packageVersion: '',
    });
    expect(http).toBeDefined();
  });

  it('should create an http client and makes a GET request', async () => {
    nock(mockParams.host).get('/test').reply(200, '');

    const http = createHttpClient({
      ...validateConfig(mockParams),
      packageVersion: '',
      requestLogger: value => value,
      responseLogger: value => value,
    });

    const test = await http.get('test');

    expect(test.data).toBe('');
  });
});
