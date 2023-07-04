import { ApiRequest, ApiRequestService } from './types';
import logs from './logs';
import { OptionsWithRql } from '../../types';
import {
  addPagersFn,
  findAllGeneric,
  findAllIterator,
  FindAllIterator,
} from '../../helpers';
import { HttpClient } from '../../http-client';
import { HttpInstance } from '../../../http/types';

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
    async find(options?: OptionsWithRql) {
      const result = await query(options);
      return addPagersFn<ApiRequest>(query, options, result);
    },

    async findAll(options?: OptionsWithRql): Promise<ApiRequest[]> {
      return findAllGeneric<ApiRequest>(query, options);
    },

    findAllIterator(options?: OptionsWithRql): FindAllIterator<ApiRequest> {
      return findAllIterator<ApiRequest>(query, options);
    },

    async findFirst(options?: OptionsWithRql): Promise<ApiRequest> {
      const result = await query(options);
      return result.data[0];
    },

    logs: logs(client, httpAuth),
  };
};
