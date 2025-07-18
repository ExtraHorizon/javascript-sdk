import nock from 'nock';
import {createOAuth2Client} from '../../../../src';
import {TASKS_BASE} from '../../../../src/constants';
import {randomHexString} from '../../../__helpers__/utils';

describe('Tasks - Schedules - DELETE', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createOAuth2Client({
    host,
    clientId: '',
  });

  it('Deletes a Schedule', async () => {
    const scheduleId = randomHexString();

    nock(`${host}${TASKS_BASE}`)
      .delete(`/schedules/${scheduleId}`)
      .reply(200, { affectedRecords: 1 });

    const { affectedRecords } = await exh.tasks.schedules.delete(scheduleId);
    expect(affectedRecords).toBe(1);
  });
});
