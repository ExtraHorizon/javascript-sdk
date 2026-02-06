import { HttpInstance } from '../../../http/types';
import {
  addPagersFn,
  findAllGeneric,
  findAllIterator,
} from '../../helpers';
import { HttpClient } from '../../http-client';
import { OptionsWithRql } from '../../types';
import logs from './logs';
import { ApiRequest, ApiRequestService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): ApiRequestService => {
  async function query(options: OptionsWithRql) {
    const { data } = await client.get(
      httpAuth,
      `/apiRequests${options?.rql || ''}`,
      options
    );
    return data;
  }

  return {
    async find(options) {
      const result = await query(options);
      return addPagersFn<ApiRequest>(query, options, result);
    },

    async findAll(options) {
      return findAllGeneric<ApiRequest>(query, options);
    },

    findAllIterator(options) {
      return findAllIterator<ApiRequest>(query, options);
    },

    async findFirst(options) {
      const result = await query(options);
      return result.data[0];
    },

    logs: logs(client, httpAuth),
  };
};
