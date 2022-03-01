import type { HttpInstance } from '../../types';
import type { HttpClient } from '../http-client';
import { Results, ResultResponse } from '../types';

export default (client: HttpClient, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(http, '/health');
    return result.status === Results.Success;
  },
});
