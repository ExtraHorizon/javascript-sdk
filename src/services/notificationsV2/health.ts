import type { HttpInstance } from '../../types';
import { ResultResponse, Results } from '../types';

export default (client, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(http, '/health');
    return result.status === Results.Success;
  },
});
