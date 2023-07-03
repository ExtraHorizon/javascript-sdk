import { HttpClient } from '../../http-client';
import { ObjectId, OptionsWithRql } from '../../types';
import { HttpInstance } from '../../../http/types';
import { LogsService, TaskLog } from './types';

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
    async find(taskId: ObjectId, options?: OptionsWithRql): Promise<TaskLog[]> {
      const { data } = await query(taskId, options);
      return data;
    },

    async findFirst(
      taskId: ObjectId,
      options?: OptionsWithRql
    ): Promise<TaskLog> {
      const result = await query(taskId, options);
      return result.data[0];
    },
  };
};
