import nock from 'nock';
import {createOAuth2Client, rqlBuilder} from '../../../../../src';
import {TASKS_BASE} from '../../../../../src/constants';
import {logLines} from '../../../../__helpers__/logs';
import {randomHexString} from '../../../../__helpers__/utils';

describe('Tasks - API Requests - Logs', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createOAuth2Client({
    host,
    clientId: '',
  });

  const apiRequestId = randomHexString();

  it('Lists API Request logs matching an RQL query', async () => {
    const rql = rqlBuilder()
      .ge('timestamp', '2023-07-04T00:00:00.000Z')
      .build();
    nock(`${host}${TASKS_BASE}`)
      .get(`/apiRequests/${apiRequestId}/logs${rql}`)
      .reply(200, { data: logLines });

    const response = await exh.tasks.apiRequests.logs.find(apiRequestId, {
      rql,
    });
    expect(response).toMatchObject(logLines);
  });

  it('Retrieves the first API Request log', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/apiRequests/${apiRequestId}/logs`)
      .reply(200, { data: logLines });

    const log = await exh.tasks.apiRequests.logs.findFirst(apiRequestId);
    expect(log).toMatchObject(logLines[0]);
  });
});
