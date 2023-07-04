import { HttpInstance } from '../../../../http/types';
import { HttpClient } from '../../../http-client';
import { ObjectId, OptionsWithRql } from '../../../types';
import { LogLine } from '../../logs/types';
import { ApiRequestLogsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ApiRequestLogsService => {
  async function query(apiRequestId: ObjectId, options: OptionsWithRql) {
    const { data } = await client.get(
      httpAuth,
      `/apiRequests/${apiRequestId}/logs${options?.rql || ''}`,
      options
    );
    return data;
  }

  return {
    async find(
      apiRequestId: ObjectId,
      options?: OptionsWithRql
    ): Promise<LogLine[]> {
      const { data } = await query(apiRequestId, options);
      return data;
    },

    async findFirst(
      apiRequestId: ObjectId,
      options?: OptionsWithRql
    ): Promise<LogLine> {
      const result = await query(apiRequestId, options);
      return result.data[0];
    },
  };
};
