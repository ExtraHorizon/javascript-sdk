// eslint-disable-next-line import/no-extraneous-dependencies
import * as nock from 'nock';
import { AUTH_BASE } from '../../../src/constants';
import { client } from '../../../src/index';

describe('Auth - Health', () => {
  const apiHost = 'https://api.xxx.fibricheck.com';

  let sdk: ReturnType<typeof client>;

  beforeAll(async () => {
    sdk = client({
      apiHost,
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Can get health', async () => {
    nock(`${apiHost}${AUTH_BASE}`).get('/health').reply(200);

    const health = await sdk.auth.health();

    expect(health).toEqual(true);
  });
});
