import type { HttpInstance } from '../../types';
import { ResultResponse, Results } from '../types';

export default (client, http: HttpInstance) => ({
  /**
   * Perform a health check
   * @returns true if the service is available
   * @throws {ServerError}
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(http, '/health');
    return result.status === Results.Success;
  },
});
