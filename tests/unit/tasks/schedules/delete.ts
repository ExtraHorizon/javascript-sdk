// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';

describe('Tasks - Schedules - DELETE', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Deletes a Schedule', async () => {
    const scheduleId = '64ad169e4d29c1b246ee25df';

    nock(`${host}${TASKS_BASE}`)
      .delete(`/schedules/${scheduleId}`)
      .reply(200, { affectedRecords: 1 });

    const { affectedRecords } = await exh.tasks.schedules.delete(scheduleId);
    expect(affectedRecords).toBe(1);
  });
});
