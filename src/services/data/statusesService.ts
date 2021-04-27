import type { HttpInstance } from '../../types';
import type { ObjectId } from '../models/ObjectId';
import type { AffectedRecords } from '../models/Responses';
import { Schema, SchemaInput, StatusData } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Create a status
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns any Success
   * @throws {ResourceAlreadyExistsError}
   */
  async createStatus(
    schemaId: ObjectId,
    requestBody: {
      name: string;
      data?: StatusData;
    }
  ): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/statuses`, requestBody))
      .data;
  },

  /**
   * Update a status
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param name The name of the targeted status.
   * @param requestBody
   * @returns any Success
   * @throws {ResourceUnknownError}
   */
  async updateStatus(
    schemaId: ObjectId,
    name: string,
    requestBody: StatusData
  ): Promise<AffectedRecords> {
    return (
      await client.put(httpAuth, `/${schemaId}/statuses/${name}`, requestBody)
    ).data;
  },

  /**
   * Delete a status
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param name The name of the targeted status.
   * @returns any Success
   * @throws {StatusInUseError}
   * @throws {ResourceUnknownError}
   */
  async deleteStatus(
    schemaId: ObjectId,
    name: string
  ): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${schemaId}/statuses/${name}`))
      .data;
  },
});
