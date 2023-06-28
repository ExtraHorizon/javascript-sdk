import { HttpClient } from '../../http-client';
import { AccessLog, LogsAccessService } from './types';
import { OptionsWithRql } from '../../types';
import { HttpInstance } from '../../../http/types';

export default (
  client: HttpClient,
  httpWithAuth: HttpInstance
): LogsAccessService => {
  async function query(options: OptionsWithRql) {
    const { data } = await client.get(
      httpWithAuth,
      `/access${options?.rql || ''}`,
      options
    );
    return data;
  }

  return {
    async find(options?: OptionsWithRql): Promise<AccessLog[]> {
      const { data } = await query(options);
      return data;
    },

    async findFirst(options?: OptionsWithRql): Promise<AccessLog> {
      const result = await query(options);
      return result.data[0];
    },
  };
};
