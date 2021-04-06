import type { HttpInstance } from '../../types';
import { resultResponse, Results } from '../../models';

export default (userClient, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: resultResponse = await userClient.get(http, '/health');
    return result.status === Results.Success;
  }

})
