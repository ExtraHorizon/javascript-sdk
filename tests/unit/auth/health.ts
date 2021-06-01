// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { createClient } from '../../../src/index';

describe('Auth - Health', () => {
  const host = 'https://api.xxx.fibricheck.com';

  let sdk: ReturnType<typeof createClient>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should get health', async () => {
    nock(`${host}${AUTH_BASE}`).get('/health').reply(200);

    const health = await sdk.auth.health();

    expect(health).toEqual(true);
  });
});
