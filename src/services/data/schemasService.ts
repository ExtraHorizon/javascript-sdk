import type { HttpInstance } from '../../types';
import { Schema, InputSchema } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Create a schema
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param requestBody
   * @returns Schema successful operation
   * @throws ApiError
   */
  async createSchema(requestBody: InputSchema): Promise<Schema> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },
});
