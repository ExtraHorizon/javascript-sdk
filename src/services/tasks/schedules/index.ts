import { HttpClient } from '../../http-client';
import { HttpInstance } from '../../../http/types';
import { ScheduleCreation, SchedulesService } from './types';
import { AffectedRecords, ObjectId, OptionsBase } from '../../types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): SchedulesService => ({
  async create(schedule: ScheduleCreation, options?: OptionsBase) {
    const { data } = await client.post(
      httpAuth,
      `/schedules`,
      schedule,
      options
    );

    return data;
  },

  async delete(
    scheduleId: ObjectId,
    options: OptionsBase
  ): Promise<AffectedRecords> {
    const { data } = await client.delete(
      httpAuth,
      `/schedules/${scheduleId}`,
      options
    );

    return data;
  },
});
