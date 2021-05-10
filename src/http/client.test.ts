import nock from 'nock';
import { validateConfig } from '../utils';
import { createHttpClient } from './client';

const mockParams = {
  apiHost: 'https://api.test.com',
  clientId: 'clientId',
};

describe('http client', () => {
  it('Create Axios client', async () => {
    const http = createHttpClient(validateConfig(mockParams));
    expect(http).toBeDefined();
  });

  it('Create Axios client + request', async () => {
    nock(mockParams.apiHost).get('/test').reply(200, '');

    const http = createHttpClient(validateConfig(mockParams));

    const test = await http.get('test');

    expect(test.data).toBe('');
  });
});
