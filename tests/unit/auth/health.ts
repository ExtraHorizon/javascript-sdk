// eslint-disable-next-line import/no-extraneous-dependencies
import * as nock from 'nock';
import { client } from '../../../src/index';

describe('Users', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';
  const authBase = '/auth/v2';
  let sdk: ReturnType<typeof client>;

  beforeAll(() => {
    sdk = client({
      apiHost,
      oauth: {
        clientId: '',
        username: '',
        password: '',
      },
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Can get health', async () => {
    nock(`${apiHost}${authBase}`).get('/health').reply(200);

    const health = await sdk.auth.health();

    expect(health).toEqual(true);
  });
});
