import type { HttpInstance } from '../../types';
import { ResultResponse, Results } from '../types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Perform a health check for profiles service
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },
});
