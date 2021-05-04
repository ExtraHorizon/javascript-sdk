import type { HttpInstance } from '../../types';
import { AffectedRecords } from '../models/Responses';
import { ObjectId } from '../models/ObjectId';
import { TypeConfiguration } from './types';

export default (client, httpAuth: HttpInstance) => ({
  /**
   * Create a property
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param requestBody
   * @returns any Success
   * @throws {ResourceAlreadyExistsError}
   * @throws {IllegalArgumentError}
   * @throws {IllegalStateException}
   * @throws {ResourceUnknownException}
   */
  async createProperty(
    schemaId: ObjectId,
    requestBody: {
      name: string;
      configuration: TypeConfiguration;
    }
  ): Promise<AffectedRecords> {
    return (await client.post(httpAuth, `/${schemaId}/properties`, requestBody))
      .data;
  },

  /**
   * Delete a property
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param propertyPath The path to the property
   * @returns any Success
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  async deleteProperty(
    schemaId: ObjectId,
    propertyPath: string
  ): Promise<AffectedRecords> {
    return (
      await client.delete(httpAuth, `/${schemaId}/properties/${propertyPath}`)
    ).data;
  },

  /**
   * Update a property
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_SCHEMAS` | `global` | **Required** for this endpoint
   * @param schemaId The id of the targeted schema.
   * @param propertyPath The path to the property
   * @param requestBody
   * @returns any Success
   * @throws {IllegalArgumentError}
   * @throws {ResourceUnknownError}
   */
  async updateProperty(
    schemaId: ObjectId,
    propertyPath: string,
    requestBody: TypeConfiguration
  ): Promise<AffectedRecords> {
    return (
      await client.put(
        httpAuth,
        `/${schemaId}/properties/${propertyPath}`,
        requestBody
      )
    ).data;
  },
});
