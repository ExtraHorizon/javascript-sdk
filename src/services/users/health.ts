import type { HttpInstance } from '../../types';
import { ResultResponse } from '../models/Responses';
import { Results } from '../models/Results';

export default (userClient, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await userClient.get(http, '/health');
    return result.status === Results.Success;
  },
});
