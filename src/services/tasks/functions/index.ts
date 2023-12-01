import { HttpInstance } from '../../../http/types';
import { HttpClient } from '../../http-client';
import { FunctionsService } from './types';

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): FunctionsService => ({
  async execute(functionName, data, options) {
    const response = await client.post(
      httpAuth,
      `/functions/${functionName}/execute`,
      { data },
      { ...options, customKeys: ['data'] }
    );
    return response.data;
  },
});
