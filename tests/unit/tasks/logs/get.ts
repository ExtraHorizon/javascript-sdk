import nock from 'nock';
import { createClient, rqlBuilder } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';
import { logLines } from '../../../__helpers__/logs';
import { randomHexString } from '../../../__helpers__/utils';

describe('Tasks - Logs ', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Lists task logs matching an RQL query', async () => {
    const taskId = randomHexString();
    const rql = rqlBuilder().ge('timestamp', '2023-06-01T00:00').build();

    nock(`${host}${TASKS_BASE}`)
      .get(`/${taskId}/logs${rql}`)
      .reply(200, { data: logLines });

    const logs = await exh.tasks.logs.find(taskId, { rql });
    expect(logs).toMatchObject(logLines);
  });

  it('Retrieves the first access log matching an RQL query', async () => {
    const taskId = randomHexString();
    const rql = rqlBuilder().ge('timestamp', '2023-06-01T00:00').build();

    nock(`${host}${TASKS_BASE}`)
      .get(`/${taskId}/logs${rql}`)
      .reply(200, { data: logLines });

    const log = await exh.tasks.logs.findFirst(taskId, { rql });
    expect(log).toMatchObject(logLines[0]);
  });
});
