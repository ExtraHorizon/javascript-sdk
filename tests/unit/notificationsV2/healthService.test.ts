import nock from 'nock';
import { NOTIFICATIONS_V2_BASE } from '../../../src/constants';
import { createClient } from '../../../src/index';

describe('Health Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const sdk = createClient({
    host,
    clientId: '',
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Requests a health check', async () => {
    nock(`${host}${NOTIFICATIONS_V2_BASE}`).get('/health').reply(200, '');
    const health = await sdk.notificationsV2.health();
    expect(health).toBe(true);
  });
});
