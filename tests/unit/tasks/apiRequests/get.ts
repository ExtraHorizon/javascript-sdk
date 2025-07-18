import nock from 'nock';
import {createOAuth2Client, rqlBuilder} from '../../../../src';
import {TASKS_BASE} from '../../../../src/constants';
import {apiRequests} from '../../../__helpers__/apiRequests';

describe('Tasks - API Requests', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createOAuth2Client({
    host,
    clientId: '',
  });

  it('Lists API Requests matching an RQL query', async () => {
    const rql = rqlBuilder().sort('-timestamp').build();
    nock(`${host}${TASKS_BASE}`)
      .get(`/apiRequests${rql}`)
      .reply(200, { data: apiRequests });

    const { data } = await exh.tasks.apiRequests.find({ rql });
    expect(data).toMatchObject(apiRequests);
  });

  it('Retrieves the first API Request', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/apiRequests`)
      .reply(200, { data: apiRequests });

    const log = await exh.tasks.apiRequests.findFirst();
    expect(log).toMatchObject(apiRequests[0]);
  });
});
