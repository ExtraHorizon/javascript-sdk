import * as nock from 'nock';
import createHttpClient from './client';

const mockParams = {
  apiHost: 'https://api.test.com',
  username: 'username',
  password: 'password',
  clientId: 'clientId',
  secret: 'secret',
};

describe('http client', () => {
  test('Create Axios client', async () => {
    const http = createHttpClient(mockParams);
    expect(http).toBeDefined();
  });

  test('Create Axios client + request', async () => {
    nock(mockParams.apiHost).get('/test').reply(200, '');

    const http = createHttpClient(mockParams);

    const test = await http.get('test');

    expect(test.data).toBe('');
  });
});
