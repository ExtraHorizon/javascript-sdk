import type { HttpInstance } from '../../types';
import type { HttpClient } from '../http-client';
import { ResultResponse, Results } from '../types';

export default (client: HttpClient, httpAuth: HttpInstance) => ({
  /**
   * Perform a health check for profiles service
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },
});
