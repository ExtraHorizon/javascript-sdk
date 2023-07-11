// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { createClient } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';
import {
  scheduleCreation,
  ScheduleDataType,
} from '../../../__helpers__/schedules';

describe('Tasks - Schedules - POST', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Creates a Schedule', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/schedules`)
      .reply(200, { data: scheduleCreation });

    const { data } = await exh.tasks.schedules.create(scheduleCreation);
    expect(data).toMatchObject(scheduleCreation);
  });

  it('Creates a Schedule using a user defined data type', async () => {
    nock(`${host}${TASKS_BASE}`)
      .post(`/schedules`)
      .reply(200, { data: scheduleCreation });

    const { data } = await exh.tasks.schedules.create<ScheduleDataType>(
      scheduleCreation
    );
    expect(data).toMatchObject(scheduleCreation);
  });
});
