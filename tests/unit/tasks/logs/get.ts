// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient, rqlBuilder } from '../../../../src';
import { taskLogs } from '../../../__helpers__/logs';
import { TASKS_BASE } from '../../../../src/constants';
import { randomHexString } from '../../../__helpers__/utils';

describe('Tasks - Logs ', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Lists task logs matching an RQL query', async () => {
    const taskId = randomHexString();
    const rql = rqlBuilder()
      .ge('timestamp', '2023-06-01T00:00')
      .limit(10)
      .build();

    nock(`${host}${TASKS_BASE}`)
      .get(`/${taskId}/logs${rql}`)
      .reply(200, { data: taskLogs });

    const logs = await exh.tasks.logs.find(taskId, { rql });
    expect(logs).toMatchObject(taskLogs);
  });

  it('Retrieves the first access log matching an RQL query', async () => {
    const taskId = randomHexString();
    const rql = rqlBuilder()
      .ge('timestamp', '2023-06-01T00:00')
      .limit(10)
      .build();

    nock(`${host}${TASKS_BASE}`)
      .get(`/${taskId}/logs${rql}`)
      .reply(200, { data: taskLogs });

    const log = await exh.tasks.logs.findFirst(taskId, { rql });
    expect(log).toMatchObject(taskLogs[0]);
  });
});
