import type { HttpInstance } from '../../types';
import { ResultResponse, Results } from '../types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Check if the service is available
   * @returns true if service is up and running
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },
});
