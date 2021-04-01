// import type { UserData } from './models';
import { HttpClientWrapper } from '../http-client';
import { resultResponse, Results } from '../../models';

export default (http: HttpClientWrapper): Record<string, any> => ({

  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: resultResponse = await http.withAuth(false).withResponseObject(true).get('/health');
    return result.status === Results.Success;
  }

});
