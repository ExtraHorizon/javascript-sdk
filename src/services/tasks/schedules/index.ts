import { HttpInstance } from '../../../http/types';
import { addPagersFn, findAllGeneric, findAllIterator } from '../../helpers';
import { HttpClient } from '../../http-client';
import { ObjectId, OptionsBase, OptionsWithRql } from '../../types';
import { Schedule, ScheduleCreation, SchedulesService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): SchedulesService => {
  async function query(options: OptionsWithRql) {
    const { data } = await client.get(
      httpAuth,
      `/schedules${options?.rql || ''}`,
      { ...options, customResponseKeys: ['data.data'] }
    );
    return data;
  }

  return {
    async create(schedule: ScheduleCreation, options?: OptionsBase) {
      const { data } = await client.post(httpAuth, '/schedules', schedule, {
        ...options,
        customKeys: ['data'],
      });

      return data;
    },

    async delete(scheduleId: ObjectId, options: OptionsBase) {
      const { data } = await client.delete(
        httpAuth,
        `/schedules/${scheduleId}`,
        options
      );

      return data;
    },

    async find(options?: OptionsWithRql) {
      const result = await query(options);
      return addPagersFn<Schedule>(query, options, result);
    },

    async findAll(options?: OptionsWithRql) {
      return findAllGeneric<Schedule>(query, options);
    },

    findAllIterator(options?: OptionsWithRql) {
      return findAllIterator<Schedule>(query, options);
    },

    async findFirst(options?: OptionsWithRql) {
      const result = await query(options);
      return result.data[0];
    },
  };
};
