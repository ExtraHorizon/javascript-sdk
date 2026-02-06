import { HttpInstance } from '../../../../http/types';
import { HttpClient } from '../../../http-client';
import { ObjectId, OptionsWithRql } from '../../../types';
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
    async find(apiRequestId, options) {
      const { data } = await query(apiRequestId, options);
      return data;
    },

    async findFirst(apiRequestId, options) {
      const result = await query(apiRequestId, options);
      return result.data[0];
    },
  };
};
