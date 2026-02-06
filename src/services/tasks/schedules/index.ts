import { HttpInstance } from '../../../http/types';
import { addPagersFn, findAllGeneric, findAllIterator } from '../../helpers';
import { HttpClient } from '../../http-client';
import { OptionsWithRql } from '../../types';
import { SchedulesService } from './types';

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
    async create(schedule, options) {
      const { data } = await client.post(httpAuth, '/schedules', schedule, {
        ...options,
        customKeys: ['data'],
      });

      return data;
    },

    async delete(scheduleId, options) {
      const { data } = await client.delete(
        httpAuth,
        `/schedules/${scheduleId}`,
        options
      );

      return data;
    },

    async find(options) {
      const result = await query(options);
      return addPagersFn(query, options, result);
    },

    async findAll(options) {
      return findAllGeneric(query, options);
    },

    findAllIterator(options) {
      return findAllIterator(query, options);
    },

    async findFirst(options?: OptionsWithRql) {
      const result = await query(options);
      return result.data[0];
    },
  };
};
