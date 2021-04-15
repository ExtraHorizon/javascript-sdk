import type { HttpInstance } from '../../types';
import { ResultResponse } from '../models/Responses';
import { Results } from '../models/Results';

export default (userClient, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @returns any Success
   * @throws {500 Error}
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await userClient.get(http, '/health');
    return result.status === Results.Success;
  },
});
