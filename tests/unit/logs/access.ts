// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { rqlBuilder, createClient } from '../../../src';
import { LOGS_BASE } from '../../../src/constants';
import { accessLogs } from '../../__helpers__/logs';

describe('Logs - Access', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Lists access logs matching an RQL query', async () => {
    const rql = rqlBuilder().ge('timestamp', '2023-06-01T00:00').build();

    nock(`${host}${LOGS_BASE}`)
      .get(`/access${rql}`)
      .reply(200, { data: accessLogs });

    const logs = await exh.logs.access.find({ rql });
    expect(logs).toMatchObject(accessLogs);
  });

  it('Retrieves the first access log matching an RQL query', async () => {
    const rql = rqlBuilder().ge('timestamp', '2023-06-01T00:00').build();

    nock(`${host}${LOGS_BASE}`)
      .get(`/access${rql}`)
      .reply(200, { data: accessLogs });

    const log = await exh.logs.access.findFirst({ rql });
    expect(log).toMatchObject(accessLogs[0]);
  });
});
