import { HttpInstance } from '../../../http/types';
import { HttpClient } from '../../http-client';
import { ObjectId, OptionsWithRql } from '../../types';
import { LogsService } from './types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): LogsService => {
  async function query(taskId: ObjectId, options: OptionsWithRql) {
    const { data } = await client.get(
      httpWithAuth,
      `/${taskId}/logs${options?.rql || ''}`,
      options
    );
    return data;
  }

  return {
    async find(taskId, options) {
      const { data } = await query(taskId, options);
      return data;
    },

    async findFirst(taskId, options) {
      const result = await query(taskId, options);
      return result.data[0];
    },
  };
};
