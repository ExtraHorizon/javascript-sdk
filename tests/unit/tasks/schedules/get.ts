import nock from 'nock';
import { createClient, rqlBuilder } from '../../../../src';
import { TASKS_BASE } from '../../../../src/constants';
import {
  ScheduleDataType,
  schedulesData,
} from '../../../__helpers__/schedules';

describe('Tasks - Schedules - GET', () => {
  const host = 'https://api.xxx.extrahorizon.com';
  const exh = createClient({
    host,
    clientId: '',
  });

  it('Lists Schedules matching an RQL query', async () => {
    const rql = rqlBuilder()
      .ge('creationTimestamp', '2023-01-01T00:00:00.001Z')
      .build();
    nock(`${host}${TASKS_BASE}`)
      .get(`/schedules${rql}`)
      .reply(200, { data: schedulesData });

    const { data } = await exh.tasks.schedules.find({ rql });
    expect(data).toMatchObject(schedulesData);
  });

  it('Retrieves the first Schedule', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/schedules`)
      .reply(200, { data: schedulesData });

    const schedule = await exh.tasks.schedules.findFirst();
    expect(schedule).toMatchObject(schedulesData[0]);
  });

  it('Lists Schedules using a user defined data type', async () => {
    nock(`${host}${TASKS_BASE}`)
      .get(`/schedules`)
      .reply(200, { data: schedulesData });

    const schedule = await exh.tasks.schedules.findFirst<ScheduleDataType>();
    expect(schedule.data.firstName).toBe(schedulesData[0].data.firstName);
    expect(schedule.data.lastName).toBe(schedulesData[0].data.lastName);
  });
});
