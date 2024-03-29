import type { HttpInstance } from '../../types';
import { Results, ResultResponse } from '../types';

export default (userClient, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await userClient.get(http, '/health');
    return result.status === Results.Success;
  },
});
