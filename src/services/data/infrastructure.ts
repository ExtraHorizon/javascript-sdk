import type { HttpInstance } from '../../types';
import { ResultResponse } from '../models/Responses';
import { Results } from '../models/Results';

export default (client, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @returns any Success
   * @throws {ServerError}
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(http, '/health');
    return result.status === Results.Success;
  },
});
